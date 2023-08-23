using NHibernate.Mapping.ByCode;
using NHibernate.Mapping.ByCode.Conformist;
using OnlineExam.Common.Domain;

namespace OnlineExam.Common.ClassMappings;

public class BaseClassMapping<T> : ClassMapping<T> where T : BaseDomain
{
    protected BaseClassMapping()
    {
        Id(x => x.Id, map => map.Generator(Generators.Identity));

        // Id(x => x.Id, m => m.Generator(Generators.Identity));

        Version(x => x.RowVersion, map =>
        {
            map.Generated(VersionGeneration.Never);
            map.UnsavedValue(0);
            map.Type(new NHibernate.Type.Int64Type());
        });
    }
}