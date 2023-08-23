using System.Security.Cryptography.Xml;
using NHibernate.Mapping.ByCode;
using NHibernate.Mapping.ByCode.Conformist;
using OnlineExam.Models.Domain;

namespace OnlineExam.Mappings.ClassMappings;

public class AnswerTestMap : ClassMapping<AnswerTest>
{
    public AnswerTestMap()
    {
        const string uniqueScore = "UNIQUE_SCORE";
        Id(x => x.Id, map => map.Generator(Generators.Identity));
        
        ManyToOne(x => x.Student, map =>
        {
            map.NotNullable(true);
            map.Column("StudentId");
            map.UniqueKey(uniqueScore);
        });
        
        ManyToOne(x => x.Exam, map =>
        {
            map.NotNullable(true);
            map.Column("ExamId");
            map.UniqueKey(uniqueScore);
        });
        
        ManyToOne(x => x.AnswerQuestion, map =>
        {
            map.NotNullable(true);
            map.Column("AnswerQuestionId");
            map.UniqueKey(uniqueScore);
        });
    }
}