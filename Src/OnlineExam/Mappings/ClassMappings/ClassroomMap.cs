using OnlineExam.Common.ClassMappings;
using OnlineExam.Models.Domain;

namespace OnlineExam.Mappings.ClassMappings;

public class ClassroomMap : BaseClassMapping<Classroom>
{
    public ClassroomMap()
    {
        Property(x => x.Name, map =>
        {
            map.Unique(true);
            map.NotNullable(true);
        });
        
        Bag(x => x.Students, map =>
        {
            map.Key(x => x.Column("ClassroomId"));
        }, map =>
        {
            map.OneToMany(x => x.Class(typeof(Student)));
        });
    }
}