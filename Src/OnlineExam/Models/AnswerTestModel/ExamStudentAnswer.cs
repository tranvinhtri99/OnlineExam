using OnlineExam.Models.DTOs;
using OnlineExam.Models.Responses.QuestionResponses;

namespace OnlineExam.Models.AnswerTestModel;

public class ExamStudentAnswer
{
    public string Name { get; set; }
    public DateTime Start { get; set; }
    public int Time { get; set; }
    
    public SubjectDto Subject { get; set; }
    // public IList<QuestionDto> Questions { get; set; }
    public IList<StudentAnswer> StudentAnswers { get; set; }
}