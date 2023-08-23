using OnlineExam.Common.Resources;

namespace OnlineExam.Common.Models;

public class ErrorResponse
{
    public string Type { get; set; }
    public string Message { get; set; }

    public static readonly ErrorResponse ErrorException = new ErrorResponse()
    {
        Type = "ErrorException",
        Message = ErrorMessage.MessageErrorException
    };
}