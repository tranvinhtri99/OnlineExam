using System;

namespace OnlineExam.React.UnitOfWork
{
    public class DisconnectedUnitOfWorkScope : IDisconnectedUnitOfWorkScope
    {
        private readonly Action _onFinished;
        public DisconnectedUnitOfWorkScope(Action onFinished)
        {
            _onFinished = onFinished;
        }

        public void Dispose()
        {
            _onFinished?.Invoke();
        }
    }
}
