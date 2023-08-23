using NHibernate.Mapping.ByCode;
using NHibernate.Mapping.ByCode.Conformist;
using OnlineExam.Models.Domain;

namespace OnlineExam.Mappings.ClassMappings;

public class AnswerQuestionMap : ClassMapping<AnswerQuestion>
{
    public AnswerQuestionMap()
    {
        Id(x => x.Id, map => map.Generator(Generators.Identity));

        Property(x => x.Answer, map =>
        {
            map.Length(2000);
            map.NotNullable(true);
            // map.UniqueKey("QuestionAnswer");
        });
        
        Property(x => x.Correct, map =>
        {
            map.NotNullable(true);
        });
        
        ManyToOne(x => x.Question, map =>
        {
            map.Column("QuestionId");
            map.NotNullable(true);
            // map.UniqueKey("QuestionAnswer");
            // map.Cascade(Cascade.DeleteOrphans | Cascade.All);
        });
        
    }
}