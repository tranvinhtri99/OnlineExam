using OnlineExam.Models.Domain;
using OnlineExam.Models.DTOs;
using OnlineExam.Models.Requests.QuestionRequest;

namespace OnlineExam.Models.Requests.ExamRequest;

public class ExamTestDto
{
    public virtual string Name { get; set; }
    public virtual DateTime Start { get; set; }
    public virtual int Time { get; set; }
    public virtual long TimeCountDown { get; set; }
    
    public virtual SubjectDto Subject { get; set; }
    public virtual IList<QuestionTestDto> Questions { get; set; }
}