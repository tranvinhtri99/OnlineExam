using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Transactions;
using NHibernate;
using OnlineExam.React.UnitOfWork;
using IsolationLevel = System.Data.IsolationLevel;

namespace ElcaBiddingAppServer.UnitOfWork.Base
{
    public abstract class AbstractBaseUnitOfWorkScope<T, TU> : IBaseUnitOfWorkScope
        where T : class, IDisposable where TU : class, IBaseUnitOfWorkScope
    {

        private class ScopeWrapper<TScope>
        {
            public ScopeWrapper(TScope scope)
            {
                Scope = scope;
            }

            public TScope Scope { get; set; }
        }


        /// <summary>
        /// Field similar to <see cref="System.Transactions.Transaction.Current" /> in oder
        /// to get access to the transaction's root scope.
        /// We have to wrap the scope into a ScopeWrapper to be able to control the value in the AsyncDispose.
        /// Because the async/await would prevent the modification of the _tCurrentScope to be leaving the
        /// DisposeAsync, we have to ensure to use a wrapper object to be able to pass out the change of the ScopeWrapper content itself.
        /// The ScopeWrapper instance is the same inside and outside of the DisposeAsync and it's kept by the AsyncLocal. Setting the
        /// _tCurrentScope directly would only propagate to all methods called by DisposeAsync.
        /// The ScopeWrapper instance itself is replaced for the downstream nesting of UnitOfWorkScope and is controlled by the normal AsyncLocal guarantuees.
        /// We just tweak the AsyncLocal behaviour on DisposeAsync. Instead of directly controlling the _tCurrentScope, we control the value of the own wrapper
        /// instance assigned to _tCurrentScope.
        /// </summary>
        private static readonly AsyncLocal<ScopeWrapper<TU>> _tCurrentScope = new AsyncLocal<ScopeWrapper<TU>> { Value = new ScopeWrapper<TU>(null) };

        // Saved 'UnitOfWorkScope.Current', represents a kind of stack frame.
        private TU _savedScope;

        /// <summary>
        /// Current property is read-only
        /// </summary>
        /// <remarks>The UnitOfWorkProvider accesses the Current property before we have created the first ScopeWrapper instance to check
        /// for ambient session scope. Therefore, _tCurrentScope.Value can sometimes be null. </remarks>
        public static TU Current => _tCurrentScope.Value?.Scope;

        private bool _complete;
        protected bool NhibernateControlsTransaction = true;
        protected ISessionFactory Factory;

        /// <summary>
        /// Creates the session local interceptor when opening a new session.
        /// </summary>
        /// <remarks>The session local interceptor must not be shared between sessions.
        /// Although a UnitofWorkscope can at most have 1 session, we still use a func here, because not every
        /// UnitofWorkscope creates a session. This saves unnecessary instantiations</remarks>
        protected Func<IInterceptor> SessionInterceptor;

        public IBaseUnitOfWorkScope ParentScope => _savedScope;
        private readonly IList<IExceptionTransform> _exceptionTransforms = new List<IExceptionTransform>();

        /// <summary>
        /// Provides access to the underlying <c>System.Transactions.TransactionScope</c>.
        /// </summary>
        public T Session => LazySession?.Value;

        protected Lazy<T> LazySession { get; private set; }

        public abstract ITransaction TransactionOfSession { get; }

        public bool IsRootScope { get; private set; }

        /// <summary>
        /// Initializes a new session (if not inherited from ambient
        /// transaction) and updates the linking to the root scope.
        /// </summary>
        protected void InitializeScopeLinking(UnitOfWorkScopeOption scopeOption, IsolationLevel isolationLevel)
        {
            InitializeScope(Current == null ? UnitOfWorkScopeOption.RequiresNew : scopeOption, isolationLevel);
        }

        private void SessionDispose()
        {
            if (Session != null)
            {
                try
                {
                    Session.Dispose(); // close is not ambient transaction aware, so use dispose instead.
                }
                catch (Exception)
                {
                    // ignore exception here as it would shadow a real exception probably.
                }
            }

            LazySession = null;
        }

        protected virtual void InheritSession()
        {
            LazySession = GetCurrentSession();
        }

        protected abstract Lazy<T> GetCurrentSession();
        protected abstract Lazy<T> CreateSession(IsolationLevel isolationLevel);

        private void InitializeNewSession(IsolationLevel isolationLevel)
        {
            LazySession = CreateSession(isolationLevel);
        }

        /// <summary>
        /// Initializes the current scope as a new child scope (= non root).
        /// </summary>
        private void InitializeScope(UnitOfWorkScopeOption scopeOption, IsolationLevel isolationLevel)
        {
            switch (scopeOption)
            {
                case UnitOfWorkScopeOption.Required:
                    // Inherit connection cache & keep current root scope
                    InheritSession();
                    PushScope(Current);
                    break;
                case UnitOfWorkScopeOption.RequiresNew:
                    // Create new connection cache & become new root scope
                    IsRootScope = true;
                    InitializeNewSession(isolationLevel);
                    PushScope(this as TU);
                    break;
                case UnitOfWorkScopeOption.Suppress:
                    // The suppress scope will restore the outer scope on dispose.  it will not provide something for UnitOfWorkScope.Current itself
                    // The inner scope of Suppressed scope will be a root scope and it will work without changes in Dispose.
                    PushScope(null);
                    break;
                default:
                    throw new InvalidOperationException("Unexpected value ScopeOption = " + scopeOption);
            }
        }

        #region PushPop

        /// <summary>
        /// Add <c>scope</c> on top of the scope calling stack. Will be removed during
        /// <c>Dispose()</c>.
        /// </summary>
        /// <param name="scope">
        /// Scope to be pushed on the calling stack.
        /// </param>
        /// <remarks>
        /// Stack structure may contain redundant frames, but this keeps a consistent
        /// stack access in the code.
        ///
        /// </remarks>
        private void PushScope(TU scope)
        {
            _savedScope = _tCurrentScope.Value?.Scope;
            _tCurrentScope.Value = new ScopeWrapper<TU>(scope);
        }

        /// <summary>
        /// Pops the top most stack frame from the scope calling stack and drops
        /// its content because it's no longer needed.
        /// </summary>
        /// <remarks>
        /// This won't necessarily exchange the <c>UnitOfWorkScope.Current</c>.
        /// </remarks>
        private void PopAndDropScope()
        {
            if (_tCurrentScope.Value != null)
            {
                _tCurrentScope.Value.Scope = _savedScope;
            }
        }

        #endregion PushPop


        protected void CommitTransaction()
        {
            if (!NhibernateControlsTransaction)
            {
                return;
            }
            try
            {
                TransactionOfSession.Commit();
            }
            finally
            {
                TransactionOfSession.Dispose();
            }
        }

        private void RollbackTransaction()
        {
            if (!NhibernateControlsTransaction)
            {
                return;
            }
            try
            {
                TransactionOfSession.Rollback();
            }
            finally
            {
                TransactionOfSession.Dispose();
            }
        }

        protected bool HasActiveTransaction()
        {
            return NhibernateControlsTransaction ?
                TransactionOfSession != null && TransactionOfSession.IsActive :
                (Transaction.Current != null && Transaction.Current.TransactionInformation.Status == TransactionStatus.Active);
        }


        /// <summary>
        /// Plugin method to execute code before clearing connection cache.
        /// </summary>
        protected virtual void PreCompleteSession()
        {
        }

        /// <summary>
        /// Plugin method to execute code after clearing connection cache.
        /// </summary>
        protected virtual void PostCompleteSession()
        {
        }


        protected void BeginTransaction(T session, IsolationLevel isolationLevel)
        {
            if (Transaction.Current == null)
            {
                // no ambient transaction
                BeginTransactionInternal(session, isolationLevel);
                NhibernateControlsTransaction = true;
            }
            else
            {
                NhibernateControlsTransaction = false;
            }
        }

        protected abstract void BeginTransactionInternal(T session, IsolationLevel isolationLevel);


        /// <summary>
        /// Indicates that all operations within the scope are completed successfully.
        /// Independent of the selected FlushMode, the session will be flushed at the outermost
        /// UnitOfWork scope if all voted for complete;
        /// </summary>
        /// <exception cref="System.InvalidOperationException">
        /// This method has already been called once.
        /// </exception>
        public void Complete()
        {
            _complete = true;
        }

        public void RegisterExceptionTransform(IExceptionTransform transform)
        {
            if (IsRootScope)
            {
                _exceptionTransforms.Add(transform);
            }
            else
            {
                ParentScope?.RegisterExceptionTransform(transform);
            }
        }
        
        protected abstract Task SessionFlushAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Complete Scope.
        /// </summary>
        /// <param name="cancellationToken">A cancellation token that can be used to cancel the work</param>
        private async Task CompleteSessionAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                PreCompleteSession();

                if (_complete && HasActiveTransaction())
                {
                    // only flush/commit if outermost scope voted for complete and transaction is still active (not terminated by an inner scope).
                    await (SessionFlushAsync(cancellationToken));
                    CommitTransaction();
                }

                PostCompleteSession();
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception e)
            {
                var transformed = false;
                // if Transform returns null, the original exception is preserved
                var transformedException = _exceptionTransforms.Aggregate(e, (current, exceptionTransform) =>
                {
                    var result = exceptionTransform.Transform(current);

                    if (result != null)
                    {
                        transformed = true;
                    }

                    return result ?? current;
                });

                if (transformed)
                {
                    throw transformedException;
                }
                else
                {
                    throw;
                }
            }
            finally
            {
                SessionDispose();
            }
        }


        #region Dispose

        /// <summary>
        /// Ends the transaction scope. Removes the frame from the scope calling stack...
        /// (a) and close the database connections if this scope was the root scope.
        /// (b) Also cleares the cache if the creation of a new transaction was suppressed
        /// or the scope (incl. child scopes) has an exclusive transaction.
        /// In other words: Do not clear the cache if the old current scope will stay alive.
        /// </summary>
        public void Dispose()
        {
            DisposeAsync().AsTask().Wait();
        }

        /// <summary>
        /// <see cref="Dispose"/>
        /// </summary>
        /// <remarks>async generator can't generate this correctly (only the DisposeInternalAsync), so we implement that part manually and let the generator handle DisposeInternalAsync</remarks>
        public async ValueTask DisposeAsync()
        {
            var oldCurrent = Current;
            await DisposeInternalAsync(oldCurrent);
        }
        
        private async Task DisposeInternalAsync(TU oldCurrent, CancellationToken cancellationToken = default(CancellationToken))
        {
            PopAndDropScope(); // we first need to ensure to cleanup the unitofworkscope stack so that we don't keep a stale unitofworkscope in the thread.
            // After PopAndDropScope, Current points to the parentscope of this scope. oldCurrent points to the state before PopAndDropScope.

            try
            {
                if (LazySession is not {IsValueCreated: true})
                {
                    return; // abort if no lazy session at all created or if the session itself has not been created.
                }

                if (!_complete && HasActiveTransaction())
                {
                    // if an inner scope doesn't vote for complete, the transaction must be rolled back.
                    // note that only the transaction is rolled back here. The session dispose (close) is done by the scope who openend the session so that we don't close multiple times.
                    try
                    {
                        RollbackTransaction();
                    }
                    catch (Exception)
                    {
                        // ignore any exception here as Rollback is most likely caused by an exception in the code. Propagating the rollback exception
                        // would then shadow the real problem.
                    }
                }

                try
                {
                    // for a scope, which opened a session:
                    // - flush the session / commit transaction if all inner scope voted for complete (i.e. transaction still active)
                    // - dispose the session now (a scope which hasn't open the session must never dispose it independant of vote for completion).
                    if (Current == null)
                    {
                        // (a) root scope (Current is null then)
                        await (CompleteSessionAsync(cancellationToken));
                    }
                    else if (oldCurrent != Current)
                    {
                        // (b) RequiresNew
                        await (CompleteSessionAsync(cancellationToken));
                    }
                }
                catch (StaleObjectStateException)
                {
                    throw new Exception(nameof(UnitOfWorkScope) + nameof(StaleObjectStateException));
                }

            }
            finally
            {
                // don't dispose session here as this must only be done by a scope which opened the session as otherwise all sessions would be disposed by inner scopes.
                LazySession = null;
            }
        }
        
        

        #endregion Dispose

    }
}
