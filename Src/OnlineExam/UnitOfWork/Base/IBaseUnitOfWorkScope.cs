using System;

// ReSharper disable once CheckNamespace
namespace OnlineExam.React.UnitOfWork
{
    public interface IBaseUnitOfWorkScope : IDisposable, IAsyncDisposable
    {
        bool IsRootScope { get; }

        IBaseUnitOfWorkScope ParentScope { get; }

        void Complete();

        void RegisterExceptionTransform(IExceptionTransform transform);
    }
}
