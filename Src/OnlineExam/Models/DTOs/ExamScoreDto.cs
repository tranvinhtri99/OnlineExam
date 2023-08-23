using OnlineExam.Common.Domain;

namespace OnlineExam.Models.DTOs;

public class ExamScoreDto : BaseDomainDto
{
    public string Name { get; set; }
    public DateTime Start { get; set; }
    public int Time { get; set; }
    
    public SubjectDto Subject { get; set; }
    public int CountQuestion { get; set; }
    public int CountScore { get; set; }
    public IList<StudentWithScoreDto> StudentWithScores { get; set; }
}