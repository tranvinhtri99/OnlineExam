namespace OnlineExam.Common.Exceptions;

public class DuplicateException : BaseBusinessException
{
    public DuplicateException(string message) : base(message)
    {
    }
}