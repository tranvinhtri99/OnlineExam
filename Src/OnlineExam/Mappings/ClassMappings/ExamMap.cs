using NHibernate.Mapping;
using NHibernate.Mapping.ByCode;
using OnlineExam.Common.ClassMappings;
using OnlineExam.Models.Domain;

namespace OnlineExam.Mappings.ClassMappings;

public class ExamMap : BaseClassMapping<Exam>
{
    public ExamMap()
    {
        Property(x => x.Name, m =>
        {
            m.NotNullable(true);
            m.Length(50);
        });
        
        Property(x => x.Start);
        Property(x => x.Time);
        
        ManyToOne(x => x.Subject, map =>
        {
            map.Column("SubjectId");
            map.NotNullable(true);
        });
        
        Bag(x => x.Questions, map =>
        {
            map.Table("QuestionExam");
            map.Key(x => x.Column("QuestionId"));
        }, map => map.ManyToMany(x => x.Class(typeof(Question))));
        
        Bag(x => x.Students, map =>
        {
            map.Table("StudentExam");
            map.Key(x => x.Column("ExamId"));
            map.Cascade(Cascade.Remove);
        }, map => map.ManyToMany(x =>
        {
            x.Class(typeof(Student));
            x.Column("StudentId");
        }));
        
        Bag(x => x.Scores,  map =>
        {
            // map.Table("StudentExam");
            map.Key(x => x.Column("ExamId"));
            map.Cascade(Cascade.Remove);
        }, map => map.OneToMany(x => x.Class(typeof(Score))));
    }
}