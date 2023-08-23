using OnlineExam.Common.Domain;

namespace OnlineExam.Models.Requests.AccountRequest;

public class UpdateLecturerDto : IKeyId
{
    public long Id { get; set; }
    public string Username { get; set; }
    public string Name { get; set; }
}