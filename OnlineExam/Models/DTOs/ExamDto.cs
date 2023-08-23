using OnlineExam.Common.Domain;
using OnlineExam.Models.Responses.QuestionResponses;

namespace OnlineExam.Models.DTOs;

public class ExamDto : BaseDomainDto
{
    public string Name { get; set; }
    public DateTime Start { get; set; }
    public int Time { get; set; }
    
    public SubjectDto Subject { get; set; }
    public IList<QuestionExamDto> Questions { get; set; }
    public IList<StudentDto> Students { get; set; }
    public IList<ScoreExamDto> Scores { get; set; }
}