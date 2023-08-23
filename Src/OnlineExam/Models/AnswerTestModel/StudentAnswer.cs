using OnlineExam.Models.DTOs;
using OnlineExam.Models.Responses.QuestionResponses;

namespace OnlineExam.Models.AnswerTestModel;

public class StudentAnswer : StudentWithScoreDto
{
    public IList<QuestionAnswer> Questions { get; set; }
}