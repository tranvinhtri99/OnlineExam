namespace OnlineExam.Common.Exceptions;

public class UniqueInsertException : BaseBusinessException
{
    public UniqueInsertException(string message) : base(message)
    {
    }
}