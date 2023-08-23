using System;

namespace OnlineExam.React.UnitOfWork.Base.Extensions
{
    public static class FlushModeExtensions
    {
        public static NHibernate.FlushMode ToNhibernateFlushMode(this FlushMode mode)
        {
            switch (mode)
            {
                case FlushMode.Default:
                case FlushMode.Readonly:
                    return NHibernate.FlushMode.Manual;
                case FlushMode.BeforeQuery:
                    return NHibernate.FlushMode.Auto;
                default:
                    throw new NotSupportedException($"FlushMode {mode} not supported");
            }
        }
    }
}
