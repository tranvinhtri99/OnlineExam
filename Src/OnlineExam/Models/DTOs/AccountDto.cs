using OnlineExam.Common.Domain;

namespace OnlineExam.Models.DTOs;

public class AccountDto : BaseDomainDto
{
    public string Username { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
}