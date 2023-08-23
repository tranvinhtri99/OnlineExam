using OnlineExam.Models.DTOs;

namespace OnlineExam.Models.Responses.AuthenticationResponses;

public class LoginReplyDto
{
    public string Token { get; set; }
    public AccountDto Account { get; set; }
}
