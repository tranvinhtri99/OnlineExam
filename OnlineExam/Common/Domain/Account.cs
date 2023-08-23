using System.Security.Claims;

namespace OnlineExam.Common.Domain;

public abstract class Account : BaseDomain
{
    public virtual string Username { get; set; }
    public virtual string Name { get; set; }
    public virtual string Password { get; set; }

    public virtual IEnumerable<Claim> GetClaims()
    {
        return Array.Empty<Claim>();
    }
}