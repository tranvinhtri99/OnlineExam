namespace OnlineExam.Common.Exceptions;

public abstract class BaseBusinessException : Exception
{
    protected BaseBusinessException(string message) : base(message)
    {
        
    }
}