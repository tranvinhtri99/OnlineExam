namespace OnlineExam.React.UnitOfWork.Base
{
    public enum FlushMode
    {
        Readonly, // maps to NHibernate FlushMode.Manual and performs dirty checking/ensures nothing flushed.
        Default, // maps to NHibernate FlushMode.Manual and flushes when outermost scope completes (default behaviour of current implementation)
        BeforeQuery, // maps to NHibernate FlushMode.Auto to flush additionally before queries to prevent reading stale state
    }
}
