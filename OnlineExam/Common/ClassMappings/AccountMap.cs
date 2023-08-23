using OnlineExam.Common.Domain;

namespace OnlineExam.Common.ClassMappings;

public class AccountMap : BaseClassMapping<Account>
{
    public AccountMap()
    {
        Property(x => x.Username, m =>
        {
            m.NotNullable(true);
            m.Length(50);
            m.Unique(true);
        });
        Property(x => x.Password, m =>
        {
            m.NotNullable(true);
            m.Length(64);
        });
        Property(x => x.Name, m =>
        {
            m.NotNullable(true);
            m.Length(50);
        });
    }
}