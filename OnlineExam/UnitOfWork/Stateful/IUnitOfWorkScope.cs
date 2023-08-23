using System;
using System.Threading;
using System.Threading.Tasks;
using NHibernate;

// ReSharper disable once CheckNamespace
namespace OnlineExam.React.UnitOfWork
{
    public partial interface IUnitOfWorkScope : IBaseUnitOfWorkScope
    {
        NHibernate.ISession Session
        {
            get;
        }

        /// <summary>
        /// Returns true if the underlining Session is dirty
        /// </summary>
        /// <returns></returns>
        bool IsDirty();

        /// <summary>
        /// <see cref="FlushNowAsync"/>
        /// </summary>
        Task FlushNowAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Creates an entity proxy from an Id using async NHiberante methods.
        /// </summary>
        /// <typeparam name="T">Type of the underlining entity</typeparam>
        /// <param name="id">Id of the entity</param>
        /// <param name="cancellationToken">optional cancellation token</param>
        Task<T> GetProxyAsync<T>(object id, CancellationToken cancellationToken = default);

        /// <summary>
        /// Initialize a lazy many-to-one or one-to-may/many-to-many (i.e. a collection)
        /// </summary>
        /// <param name="proxy"></param>
        /// <param name="cancellationToken">optional cancellation token</param>
        Task InitializeProxyAsync(object proxy, CancellationToken cancellationToken = default);

            /// <summary>
            /// Disconnect the current session.
            /// Flush the session and commits the transaction, disconnect the current session, suppress the current unitofwork scope
            /// so no inner method can work with the disconnected session.
            /// </summary>
            /// <exception cref="InvalidOperationException">Throws if the current scope is not the outermost.</exception>
            /// <returns></returns>
            Task<IDisconnectedUnitOfWorkScope> DisconnectAsync(CancellationToken cancellationToken = default);
            /// <summary>
            /// Try to disconnect the current session.
            /// Similar to <see cref="Disconnect"/> but will not throw exception and disconnect the session if it is not the outer most scope
            /// </summary>
            /// <returns></returns>
            Task<IDisconnectedUnitOfWorkScope> TryDisconnectAsync(CancellationToken cancellationToken = default);

        

    }
}
