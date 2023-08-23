using OnlineExam.Common.ClassMappings;
using OnlineExam.Models.Domain;
using Cascade = NHibernate.Mapping.ByCode.Cascade;

namespace OnlineExam.Mappings.ClassMappings;

public class SubjectMap : BaseClassMapping<Subject>
{
    public SubjectMap()
    {
        Property(x => x.Code, map =>
        {
            map.Type<NHibernate.Type.Int64Type>();
            map.Unique(true);
        });
        
        Property(x => x.Name, map =>
        {
            map.NotNullable(true);
            map.Length(100);
        });
        
        Property(x => x.NoCredit, map =>
        {
            map.NotNullable(true);
        });

        Bag(x => x.Questions, map =>
        {
            // map.Table("Question");
            map.Key(x =>
            {
                x.Column("SubjectId");
            });
            map.Cascade(Cascade.None);
        }, m =>
        {
            m.OneToMany(x => x.Class(typeof(Question)));
        });
        
        Bag(x => x.Exams, map =>
        {
            // map.Table("Question");
            map.Key(x =>
            {
                x.Column("SubjectId");
            });
            map.Cascade(Cascade.None);
        }, m =>
        {
            m.OneToMany(x => x.Class(typeof(Exam)));
        });
        
        

    }
}