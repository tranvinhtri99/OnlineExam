namespace OnlineExam.Common.Tokens;

public class JwtSecretKey
{
    public string SecretKey { get; set; } = "HoangVuIT";
    public int TimeExpired { get; set; } = 5;
}