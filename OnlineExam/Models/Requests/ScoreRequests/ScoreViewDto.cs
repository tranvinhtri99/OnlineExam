using OnlineExam.Common.Domain;

namespace OnlineExam.Models.Requests.ScoreRequests;

public class ScoreViewDto : IKeyId
{
    public long Id { get; set; }
    public float Score { get; set; }
    public string ExamName { get; set; }
    public string SubjectName { get; set; }
}