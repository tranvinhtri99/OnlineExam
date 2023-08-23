using System;
using System.Data;
using System.Threading.Tasks;
using OnlineExam.React.UnitOfWork.Base;

// ReSharper disable once CheckNamespace
namespace OnlineExam.React.UnitOfWork
{
    public interface IUnitOfWorkProvider
    {
        void PerformActionInUnitOfWork(Action action);

        void PerformActionInUnitOfWork(Action action, UnitOfWorkScopeOption scopeOption);

        void PerformActionInUnitOfWork(Action action, UnitOfWorkScopeOption scopeOption, IsolationLevel isolationLevel);

        T PerformActionInUnitOfWork<T>(Func<T> action);

        T PerformActionInUnitOfWork<T>(Func<T> action, UnitOfWorkScopeOption scopeOption);

        T PerformActionInUnitOfWork<T>(Func<T> action, UnitOfWorkScopeOption scopeOption, IsolationLevel isolationLevel);

        Task PerformActionInUnitOfWorkAsync(Func<Task> action);

        Task PerformActionInUnitOfWorkAsync(Func<Task> action, UnitOfWorkScopeOption scopeOption);

        Task PerformActionInUnitOfWorkAsync(Func<Task> action, UnitOfWorkScopeOption scopeOption, IsolationLevel isolationLevel);

        Task<T> PerformActionInUnitOfWorkAsync<T>(Func<Task<T>> action);

        Task<T> PerformActionInUnitOfWorkAsync<T>(Func<Task<T>> action, UnitOfWorkScopeOption scopeOption);

        Task<T> PerformActionInUnitOfWorkAsync<T>(Func<Task<T>> action, UnitOfWorkScopeOption scopeOption, IsolationLevel isolationLevel);

        IUnitOfWorkScope Provide();

        IUnitOfWorkScope Provide(UnitOfWorkScopeOption scopeOption);

        IUnitOfWorkScope Provide(UnitOfWorkScopeOption scopeOption, IsolationLevel isolationLevel, FlushMode flushMode);
    }
}
