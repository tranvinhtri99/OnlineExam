namespace OnlineExam.Common.Exceptions;

public class VersionMismatchException : BaseBusinessException
{
    public VersionMismatchException(string message) : base(message)
    {
    }
}