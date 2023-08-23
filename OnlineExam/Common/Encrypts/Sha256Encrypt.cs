using System.Security.Cryptography;
using System.Text;

namespace OnlineExam.Common.Encrypts;

public static class EncryptExtension
{
    public static string ToSha256(this string password)
    {
        return Sha256Encrypt.Sha256(password);
    }
}

public static class Sha256Encrypt
{
    public static string Sha256(string text)
    {
        using var sha256Hash = SHA256.Create();

        sha256Hash.ComputeHash(Encoding.ASCII.GetBytes(text));
        var result = sha256Hash.Hash;

        StringBuilder strBuilder = new();
        for (var i = 0; i < result?.Length; i++)
        {
            strBuilder.Append(result![i].ToString("x2"));
        }

        return strBuilder.ToString();
    }
}

public static class RandomHelper
{
    public const string ASCII_UPPERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    public const string ASCII_LOWERS = "abcdefghijklmnopqrstuvwxyz";
    public const string ASCII_LETTERS = ASCII_UPPERS + ASCII_LOWERS;
    public const string DIGITS = "0123456789";
    public const string ALL = ASCII_LETTERS + DIGITS;
    
    private static readonly Random _random = new(DateTime.Now.Millisecond);
    private static string RandomString(string source, int number = 1)
    {
        var maxlength = source.Length;
        var sb = new StringBuilder();
        for (var i = 0; i < number; i++)
        {
            sb.Append(source[_random.Next(1, maxlength)]);
        }
            

        return sb.ToString();
    }

    public static string RandomPassword() => RandomString(ALL, 16);
}