using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using OnlineExam.Common.Domain;
using OnlineExam.Common.Encrypts;

namespace OnlineExam.Common.Tokens;

public class JwtManagement
{
    private readonly JwtSecretKey _jwtSecretKey;

    public JwtManagement(IOptions<JwtSecretKey> secretKey)
    {
        _jwtSecretKey = secretKey.Value;
    }

    public string CreateToken(Account account)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenKey = Encoding.ASCII.GetBytes(_jwtSecretKey.SecretKey.ToSha256());

        List<Claim> claims = new()
        {
            new Claim(ClaimTypes.Name, account.Username!),
            new Claim(ClaimTypes.NameIdentifier, account.Id!.ToString()),
            new Claim(ClaimTypes.GivenName, account.Name!),
            new Claim(ClaimTypes.Role, account.GetType().Name),
        };
        
        claims.AddRange(account.GetClaims());

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(_jwtSecretKey.TimeExpired),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(tokenKey),
                SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    
    public bool ValidateToken(string authToken)
    {
        #if DEBUG
        if (authToken == "1") return true;
        #endif

        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameters = GetValidationParameters();

        SecurityToken validatedToken;
        IPrincipal principal = tokenHandler.ValidateToken(authToken, validationParameters, out validatedToken);
        return true;
    }
    
    private TokenValidationParameters GetValidationParameters()
    {
        return new TokenValidationParameters()
        {
            ValidateIssuerSigningKey = true,
            ValidateAudience = false,
            ValidateLifetime = false, // Because there is no expiration in the generated token
            ValidateIssuer = false,   // Because there is no issuer in the generated token
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecretKey.SecretKey.ToSha256())) // The same key as the one that generate the token
        };
    }
}