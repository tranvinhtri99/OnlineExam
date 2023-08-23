using OnlineExam.Common.Domain;
using OnlineExam.Models.DTOs;

namespace OnlineExam.Models.Requests.ScoreRequests;

public class ScoreDto : IKeyId
{
    public long Id { get; set; }
    public float Point { get; set; }

    public StudentDto Student { get; set; }
    public ExamListDto Exam { get; set; }
}