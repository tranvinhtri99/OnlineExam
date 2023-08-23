using OnlineExam.Common.Exceptions;
using OnlineExam.Common.Resources;

namespace OnlineExam.Models.Exceptions;

public class NotFoundException : BaseBusinessException
{
    public NotFoundException(string message) : base(message)
    {
    }
    
    public NotFoundException() : this(ErrorMessage.MessageNotFound)
    {
    }
}