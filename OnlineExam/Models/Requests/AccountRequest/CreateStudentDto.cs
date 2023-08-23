namespace OnlineExam.Models.Requests.AccountRequest;

public class CreateStudentDto
{
    public string Username { get; set; }
    public string Name { get; set; }
    public string Password { get; set; }
    public long ClassroomId { get; set; }
}