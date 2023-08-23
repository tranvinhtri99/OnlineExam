using OnlineExam.Common.Domain;
using OnlineExam.Models.Responses.QuestionResponses;

namespace OnlineExam.Models.DTOs;

public class ExamListDto : BaseDomainDto
{
    public string Name { get; set; }
    public DateTime Start { get; set; }
    public int Time { get; set; }
    
    public SubjectDto Subject { get; set; }
    public int CountQuestion { get; set; }
    public int CountStudents { get; set; }
    public int CountScores { get; set; }
}