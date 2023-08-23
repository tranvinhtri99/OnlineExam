using System;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using ElcaBiddingAppServer.UnitOfWork.Base;
using NHibernate;
using OnlineExam.React.UnitOfWork.Base.Extensions;
using FlushMode = OnlineExam.React.UnitOfWork.Base.FlushMode;

// ReSharper disable once CheckNamespace
namespace OnlineExam.React.UnitOfWork
{
    public class UnitOfWorkScope : AbstractBaseUnitOfWorkScope<NHibernate.ISession, UnitOfWorkScope>, IUnitOfWorkScope
    {
        private static readonly Func<IInterceptor> CreateEmptyInterceptor = () => EmptyInterceptor.Instance;

        private const string NoSession = "No session";
        private readonly FlushMode _flushMode;
        private readonly IsolationLevel _isolationLevel;
        private ITransaction _transaction;

        #region IConstructors

        /// <summary>Initializes a new instance of the
        /// <see cref="UnitOfWorkScope" /> class.
        /// </summary>
        /// <remarks>
        /// Uses <see cref="System.Transactions.TransactionScopeOption.Required" />
        /// default for UnitOfWorkScope inheritance.
        /// </remarks>
        public UnitOfWorkScope(ISessionFactory factory)
            : this(UnitOfWorkScopeOption.Required, factory, FlushMode.Default)
        {
        }

        /// <summary>Initializes a new instance of the
        /// <see cref="UnitOfWorkScope" /> class.
        /// with the specified requirements.
        /// </summary>
        /// <param name="scopeOption">
        /// An instance of the <see cref="System.Transactions.TransactionScopeOption" />
        /// enumeration that describes the transaction requirements associated
        /// with this transaction scope.
        /// </param>
        /// <param name="factory"></param>
        /// <param name="flushMode"></param>
        public UnitOfWorkScope(UnitOfWorkScopeOption scopeOption, ISessionFactory factory, FlushMode flushMode)
            : this(scopeOption, IsolationLevel.ReadCommitted, factory, flushMode)
        {
        }

        /// <summary>
        /// Initializes a new instance of the
        /// <see cref="UnitOfWorkScope" /> class.
        /// with the specified requirements.
        /// </summary>
        /// <param name="scopeOption">
        /// An instance of the <see cref="System.Transactions.TransactionScopeOption" />
        /// enumeration that describes the transaction requirements associated
        /// with this transaction scope.
        /// </param>
        /// <param name="transactionOptions">
        /// A <see cref="System.Transactions.TransactionOptions" /> structure
        /// that describes the transaction options to use if a new transaction
        /// is created. If an existing transaction is used, the timeout value in
        /// this parameter applies to the transaction scope. If that time expires
        /// before the scope is disposed, the transaction is aborted.
        /// </param>
        /// <param name="factory"></param>
        /// <param name="flushMode"></param>
        public UnitOfWorkScope(UnitOfWorkScopeOption scopeOption,
                                IsolationLevel transactionOptions, ISessionFactory factory, FlushMode flushMode)
            : this(scopeOption, transactionOptions, factory, CreateEmptyInterceptor, flushMode)
        {

        }

        /// <summary>
        /// Initializes a new instance of the
        /// <see cref="UnitOfWorkScope" /> class.
        /// with the specified requirements.
        /// </summary>
        /// <param name="scopeOption">
        /// An instance of the <see cref="System.Transactions.TransactionScopeOption" />
        /// enumeration that describes the transaction requirements associated
        /// with this transaction scope.
        /// </param>
        /// <param name="transactionOptions">
        /// A <see cref="System.Transactions.TransactionOptions" /> structure
        /// that describes the transaction options to use if a new transaction
        /// is created. If an existing transaction is used, the timeout value in
        /// this parameter applies to the transaction scope. If that time expires
        /// before the scope is disposed, the transaction is aborted.
        /// </param>
        /// <param name="factory"></param>
        /// <param name="sessionInterceptor"></param>
        /// <param name="flushMode"></param>
        /// The <see cref="IInterceptor"/> is passed from <see cref="UnitOfWorkProvider"/>.
        /// Instant of IInterceptor is provided in "ContextInterceptorModule.cs"
        public UnitOfWorkScope(UnitOfWorkScopeOption scopeOption,
            IsolationLevel transactionOptions, ISessionFactory factory, Func<IInterceptor> sessionInterceptor, FlushMode flushMode)
        {
            Factory = factory;
            SessionInterceptor = sessionInterceptor;
            InitializeScopeLinking(scopeOption, transactionOptions);
            _isolationLevel = transactionOptions;
            _flushMode = flushMode;
        }

        #region InitializeScope

        protected override Lazy<NHibernate.ISession> GetCurrentSession()
        {
            return Current.LazySession;
        }

        protected override void InheritSession()
        {
            base.InheritSession();
            _transaction = Current._transaction;
        }

        protected override Lazy<NHibernate.ISession> CreateSession(IsolationLevel isolationLevel)
        {
            return new Lazy<NHibernate.ISession>(() =>
            {
                var result = Factory.WithOptions().Interceptor(SessionInterceptor()).FlushMode(_flushMode.ToNhibernateFlushMode()).OpenSession();
                BeginTransaction(result, isolationLevel);
                return result;
            }, LazyThreadSafetyMode.None); // using LazyThreadSafetyMode.None here for performance; as UnitOfWorkScope is thread static, it can only be called from one thread.
        }

        internal bool IsUsingSessionFactory(ISessionFactory sessionFactory)
        {
            return Factory == sessionFactory;
        }


        #endregion InitializeScope

        #region Complete
        public Task InitializeProxyAsync(object proxy, CancellationToken cancellationToken = default)
        {
            try
            {
                if (NHibernateUtil.IsInitialized(proxy))
                {
                    return Task.CompletedTask;
                }

                return Session != null ? NHibernateUtil.InitializeAsync(proxy, cancellationToken) : Task.FromException<object>(new InvalidOperationException(NoSession));
            }
            catch (Exception ex)
            {
                return Task.FromException<object>(ex);
            }
        }

        #endregion Complete

        #region SessionHandling
        
        protected override Task SessionFlushAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                AssertReadonlyScopeNotDirty();
                return Session.FlushAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                return Task.FromException<object>(ex);
            }
        }

        protected override void BeginTransactionInternal(NHibernate.ISession session, IsolationLevel isolationLevel)
        {
            _transaction = session.BeginTransaction(isolationLevel);
        }

        public override ITransaction TransactionOfSession => _transaction;

        #endregion SessionHandling

        public Task FlushNowAsync(CancellationToken cancellationToken = default)
        {
            return SessionFlushAsync(cancellationToken);
        }

        /// <summary>
        /// Creates an entity proxy from an Id
        /// </summary>
        /// <typeparam name="T">Type of the underlining entity</typeparam>
        /// <param name="id">Id of the entity</param>
        /// <param name="cancellationToken">A cancellation token that can be used to cancel the work</param>
        public Task<T> GetProxyAsync<T>(object id, CancellationToken cancellationToken = default)
        {
            try
            {
                return Session != null ? Session.LoadAsync<T>(id, cancellationToken) : Task.FromException<T>(new InvalidOperationException(NoSession));
            }
            catch (Exception ex)
            {
                return Task.FromException<T>(ex);
            }
        }
        
        public static Task<T> GetProxyObjectAsync<T>(object id, CancellationToken cancellationToken = default)
        {
            try
            {
                return Current?.Session != null ? Current.Session.LoadAsync<T>(id, cancellationToken) : Task.FromException<T>(new InvalidOperationException(NoSession));
            }
            catch (Exception ex)
            {
                return Task.FromException<T>(ex);
            }
        }
        
        public bool IsReadonly()
        {
            return _flushMode == FlushMode.Readonly;
        }
        
        /// <summary>
        /// Creates an entity proxy from an Id
        /// </summary>
        /// <typeparam name="T">Type of the underlining entity</typeparam>
        /// <param name="id">Id of the entity</param>
        public T GetProxy<T>(object id)
        {
            if (Session != null)
            {
                return Session.Load<T>(id);
            }
            throw new InvalidOperationException(NoSession);
        }


        public bool IsDirty()
        {
            return Session.IsDirty();
        }

        private void AssertReadonlyScopeNotDirty()
        {
            if (IsReadonly() && IsDirty())
            {
                throw new InvalidOperationException("Modification is not allowed in read only UnitOfWorkScope.");
            }
        }

        /// <summary>
        /// <inheritdoc />
        /// </summary>
        /// <param name="cancellationToken">A cancellation token that can be used to cancel the work</param>
        public Task<IDisconnectedUnitOfWorkScope> DisconnectAsync(CancellationToken cancellationToken = default)
        {
            if (!IsRootScope)
            {
                throw new InvalidOperationException("Cannot disconnect when the scope is not the root scope as it would break the semantic of 1 transaction.");
            }

            return TryDisconnectAsync(cancellationToken);
        }

        /// <summary>
        /// <inheritdoc />
        /// </summary>
        /// <param name="cancellationToken">A cancellation token that can be used to cancel the work</param>
        public async Task<IDisconnectedUnitOfWorkScope> TryDisconnectAsync(CancellationToken cancellationToken = default)
        {

            var sessionCreated = LazySession != null && LazySession.IsValueCreated;
            var transactionCommitted = false;
            if (sessionCreated && IsRootScope)
            {
                if (HasActiveTransaction())
                {
                    await (SessionFlushAsync(cancellationToken));
                    CommitTransaction();
                    transactionCommitted = true;
                }

                Session.Disconnect();
            }

            // supress the current scope anyway as we do not want to share with inner scope
            // we only want to make sure, the inner scope cannot access to this scope
            var supressedScope = new UnitOfWorkScope(UnitOfWorkScopeOption.Suppress, Factory, FlushMode.Default);

            return new DisconnectedUnitOfWorkScope(() =>
            {
                try
                {
                    if (sessionCreated && IsRootScope)
                    {
                        Session.Reconnect();
                    }
                }
                finally
                {
                    supressedScope.Dispose();
                }

                if (transactionCommitted)
                {
                    // opens new transaction as the previous one was committed before disconnecting.
                    BeginTransaction(Session, _isolationLevel);
                }
            });
        }
        #endregion IMethods
    }
}
