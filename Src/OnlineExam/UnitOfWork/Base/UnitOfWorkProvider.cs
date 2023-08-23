using System;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NHibernate;
using FlushMode = OnlineExam.React.UnitOfWork.Base.FlushMode;

// ReSharper disable once CheckNamespace
namespace OnlineExam.React.UnitOfWork
{
    public class UnitOfWorkProvider : IUnitOfWorkProvider
    {
        private static readonly Func<IInterceptor> CreateEmptyInterceptor = () => EmptyInterceptor.Instance;

        protected ISessionFactory SessionFactory;
        /// <summary>
        /// create the session local session interceptor.
        /// </summary>
        /// <remarks>we must not share session local interceptors between sessions, therefore, use a func here, so that
        /// a new instance can be created by the UnitofWorkscope when opening a session</remarks>
        protected Func<IInterceptor> SessionInterceptor;


        public UnitOfWorkScopeOption DetermineScopeOption()
        {
            var scopeOption = UnitOfWorkScopeOption.Required;
            if (IsSessionFactoryOfAmbientScopeDifferent())
            {
                scopeOption = UnitOfWorkScopeOption.RequiresNew;
            }
            return scopeOption;
        }

        public void PerformActionInUnitOfWork(Action action)
        {
            PerformActionInUnitOfWork(action, DetermineScopeOption(), IsolationLevel.ReadCommitted);
        }

        public void PerformActionInUnitOfWork(Action action, UnitOfWorkScopeOption scopeOption)
        {
            PerformActionInUnitOfWork(action, scopeOption, IsolationLevel.ReadCommitted);
        }

        public void PerformActionInUnitOfWork(Action action, IsolationLevel isolationLevel)
        {
            PerformActionInUnitOfWork(action, DetermineScopeOption(), isolationLevel);
        }

        public void PerformActionInUnitOfWork(Action action, UnitOfWorkScopeOption scopeOption, IsolationLevel isolationLevel)
        {
            using (var scope = Provide(scopeOption, isolationLevel, FlushMode.Default))
            {
                action();
                scope.Complete();
            }
        }

        public Task PerformActionInUnitOfWorkAsync(Func<Task> action)
        {
            return PerformActionInUnitOfWorkAsync(action, DetermineScopeOption(), IsolationLevel.ReadCommitted);
        }

        public Task PerformActionInUnitOfWorkAsync(Func<Task> action, UnitOfWorkScopeOption scopeOption)
        {
            return PerformActionInUnitOfWorkAsync(action, scopeOption, IsolationLevel.ReadCommitted);
        }

        public Task PerformActionInUnitOfWorkAsync(Func<Task> action, IsolationLevel isolationLevel)
        {
            return PerformActionInUnitOfWorkAsync(action, DetermineScopeOption(), isolationLevel);
        }

        public async Task PerformActionInUnitOfWorkAsync(Func<Task> action, UnitOfWorkScopeOption scopeOption, IsolationLevel isolationLevel)
        {
            using (var scope = Provide(scopeOption, isolationLevel, FlushMode.Default))
            {
                await action();
                scope.Complete();
            }
        }

        public T PerformActionInUnitOfWork<T>(Func<T> action)
        {
            return PerformActionInUnitOfWork(action, DetermineScopeOption(), IsolationLevel.ReadCommitted);
        }

        public T PerformActionInUnitOfWork<T>(Func<T> action, UnitOfWorkScopeOption scopeOption)
        {
            return PerformActionInUnitOfWork(action, scopeOption, IsolationLevel.ReadCommitted);
        }

        public T PerformActionInUnitOfWork<T>(Func<T> action, UnitOfWorkScopeOption scopeOption, IsolationLevel isolationLevel)
        {
            T result;
            using (var scope = Provide(scopeOption, isolationLevel, FlushMode.Default))
            {
                result = action();
                scope.Complete();
            }

            return result;
        }

        public Task<T> PerformActionInUnitOfWorkAsync<T>(Func<Task<T>> action)
        {
            return PerformActionInUnitOfWorkAsync(action, DetermineScopeOption(), IsolationLevel.ReadCommitted);
        }

        public Task<T> PerformActionInUnitOfWorkAsync<T>(Func<Task<T>> action, UnitOfWorkScopeOption scopeOption)
        {
            return PerformActionInUnitOfWorkAsync(action, scopeOption, IsolationLevel.ReadCommitted);
        }

        public async Task<T> PerformActionInUnitOfWorkAsync<T>(Func<Task<T>> action, UnitOfWorkScopeOption scopeOption, IsolationLevel isolationLevel)
        {
            T result;
            using (var scope = Provide(scopeOption, isolationLevel, FlushMode.Default))
            {
                result = await action();
                scope.Complete();
            }

            return result;
        }

        public UnitOfWorkProvider(ISessionFactory sessionFactory) : this(sessionFactory,
            CreateEmptyInterceptor)
        {
        }

        public UnitOfWorkProvider(ISessionFactory sessionFactory, Func<IInterceptor> sessionInterceptor)
        {
            SessionFactory = sessionFactory;
            SessionInterceptor = sessionInterceptor;
        }

        public IUnitOfWorkScope Provide()
        {
            return Provide(DetermineScopeOption());
        }

        public IUnitOfWorkScope Provide(IsolationLevel isolationLevel)
        {
            return Provide(DetermineScopeOption(), isolationLevel, FlushMode.Default);
        }


        public IUnitOfWorkScope Provide(UnitOfWorkScopeOption scopeOption)
        {
            return Provide(scopeOption, IsolationLevel.ReadCommitted, FlushMode.Default);
        }

        public IUnitOfWorkScope Provide(UnitOfWorkScopeOption scopeOption, IsolationLevel isolationLevel, FlushMode flushMode)
        {
            if (IsSessionFactoryOfAmbientScopeDifferent() && scopeOption == UnitOfWorkScopeOption.Required)
            {
                throw new ArgumentException("ambient unit of work has incompatible session, please use RequiresNew to create a new Unit of Work.");
            }
            return new UnitOfWorkScope(scopeOption, isolationLevel, SessionFactory, SessionInterceptor, flushMode);
        }

        public bool IsSessionFactoryOfAmbientScopeDifferent()
        {
            return (UnitOfWorkScope.Current != null &&
                    !UnitOfWorkScope.Current.IsUsingSessionFactory(SessionFactory));
        }
    }
}
