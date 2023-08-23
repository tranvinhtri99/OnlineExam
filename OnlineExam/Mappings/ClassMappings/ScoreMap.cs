using NHibernate.Mapping.ByCode;
using NHibernate.Mapping.ByCode.Conformist;
using OnlineExam.Models.Domain;

namespace OnlineExam.Mappings.ClassMappings;

public class ScoreMap : ClassMapping<Score>
{
    public ScoreMap()
    {
        Id(x => x.Id, map => map.Generator(Generators.Identity));
        
        Property(x => x.Point);
        
        ManyToOne(x => x.Student, map =>
        {
            map.Column("StudentId");
            map.NotNullable(true);
            map.UniqueKey("Student_Exam");
        });
        
        ManyToOne(x => x.Exam, map =>
        {
            map.Column("ExamId");
            map.NotNullable(true);
            map.UniqueKey("Student_Exam");
        });
    }
}