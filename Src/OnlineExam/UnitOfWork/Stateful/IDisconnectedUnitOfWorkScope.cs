using System;

namespace OnlineExam.React.UnitOfWork
{
    /// <summary>
    /// A disposable struct containing disconnected Nhibernate session which will reconnect upon diposal.
    /// </summary>
    public interface IDisconnectedUnitOfWorkScope : IDisposable
    {
    }
}
