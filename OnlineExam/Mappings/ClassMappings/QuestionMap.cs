using OnlineExam.Common.ClassMappings;
using OnlineExam.Common.Enums;
using OnlineExam.Models.Domain;
using Cascade = NHibernate.Mapping.ByCode.Cascade;

namespace OnlineExam.Mappings.ClassMappings;

public class QuestionMap : BaseClassMapping<Question>
{
    public QuestionMap()
    {
        Property(x => x.Type, map =>
        {
            map.Type<NHibernate.Type.EnumStringType<TypeQuestion>>();
            map.NotNullable(true);
            map.Length(20);
        });
        
        Property(x => x.Text, map =>
        {
            map.NotNullable(true);
            map.Length(2000);
            map.Unique(true);
        });
        
        Property(x => x.Level, map =>map.NotNullable(true));

        Bag(x => x.Answers, map =>
        {
            // map.Table("AnswerQuestion");
            map.Key(x =>
            {
                x.Column("QuestionId");
            });
            map.Cascade(Cascade.DeleteOrphans | Cascade.All);
            map.Inverse(true);
        }, map =>
        {
            map.OneToMany(x => x.Class(typeof(AnswerQuestion)));
        });

        ManyToOne(x => x.Subject, map =>
        {
            map.NotNullable(true);
            map.Column("SubjectId");
        });
    }
}