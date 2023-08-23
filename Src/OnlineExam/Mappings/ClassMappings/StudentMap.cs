using NHibernate.Mapping;
using NHibernate.Mapping.ByCode;
using NHibernate.Mapping.ByCode.Conformist;
using OnlineExam.Common.ClassMappings;
using OnlineExam.Models.Domain;

namespace OnlineExam.Mappings.ClassMappings;

public class StudentMap : BaseSubclassMapping<Student>
{
    public StudentMap()
    {
        ManyToOne(x => x.Classroom, map =>
        {
            map.NotNullable(false);
            map.Column("ClassroomId");
        });
        
        Bag(x => x.Scores, map =>
        {
            map.Key(x => x.Column("StudentId"));
            map.Cascade(Cascade.None);
        }, map => map.OneToMany(x => x.Class(typeof(Score))));
        
        Bag(x => x.Exams, map =>
        {
            map.Table("StudentExam");
            map.Key(x => x.Column("StudentId"));
            map.Cascade(Cascade.Remove);
        }, map => map.ManyToMany(x =>
        {
            x.Class(typeof(Exam));
            x.Column("ExamId");
        }));
    }
}