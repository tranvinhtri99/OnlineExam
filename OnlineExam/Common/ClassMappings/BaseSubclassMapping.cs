using NHibernate.Mapping;
using NHibernate.Mapping.ByCode.Conformist;

namespace OnlineExam.Common.ClassMappings;

public class BaseSubclassMapping<T> : JoinedSubclassMapping<T> where T: class
{
    public BaseSubclassMapping()
    {
        // DiscriminatorValue(typeof(T).Name);
    }
}