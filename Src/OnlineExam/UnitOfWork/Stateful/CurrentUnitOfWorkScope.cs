using System;

// ReSharper disable once CheckNamespace
namespace OnlineExam.React.UnitOfWork
{
    /// <summary>
    /// Since <see cref="UnitOfWorkScope.Current"/> is essentiyll "unmockable" due to the generic constraints
    /// and because static properties make testing very difficult in general, this class here provides an
    /// abstraction around the current unit of work scope that can actually be mocked for testing.
    /// </summary>
    public static class CurrentUnitOfWorkScope
    {
        public static IUnitOfWorkScope Instance => UnitOfWorkScope.Current;
    }
}
