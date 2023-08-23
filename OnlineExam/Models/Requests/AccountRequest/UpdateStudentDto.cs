using OnlineExam.Common.Domain;

namespace OnlineExam.Models.Requests.AccountRequest;

public class UpdateStudentDto: IKeyId, IRowVersion
{
    public long Id { get; set; }
    public long RowVersion { get; set; }
    public string Username { get; set; }
    public string Name { get; set; }
    public long ClassroomId { get; set; }
    
}