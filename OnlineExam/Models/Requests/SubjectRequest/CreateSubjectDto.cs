namespace OnlineExam.Models.Requests.SubjectRequest;

public class CreateSubjectDto
{
    public long Code { get; set; }
    public string Name { get; set; }
    public int NoCredit { get; set; }
}