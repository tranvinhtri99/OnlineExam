using System;

// ReSharper disable once CheckNamespace
namespace OnlineExam.React.UnitOfWork
{
    /// <summary>
    /// Can be used to "customize" exceptions that occur in a unit of work.
    /// </summary>
    public interface IExceptionTransform
    {
        /// <summary>
        /// Transforms a given exception into a new exception or returns null to indicate no modification.
        /// </summary>
        /// <param name="previous">Previous / original exception (multiple transforms can be applied to the same exception)</param>
        /// <returns>A new exception (with more specific information) or null if the exception is not modified</returns>
        Exception Transform(Exception previous);
    }
}
