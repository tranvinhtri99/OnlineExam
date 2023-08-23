using NHibernate.Validator.Cfg.Loquacious;
using OnlineExam.Models.Domain;

namespace OnlineExam.Mappings.MappingValidators;

public class SubjectMapValidator: ValidationDef<Subject>
{
    public SubjectMapValidator()
    {
        ValidateInstance.By((subject, context) =>
        {
            if (subject.NoCredit is > 0 and < 20) return true;
            
            context.AddInvalid<Subject, int>("Number of Credit invalid (NoCredit in range 1-20)", x => x.NoCredit);
            return false;
        });
    }
}