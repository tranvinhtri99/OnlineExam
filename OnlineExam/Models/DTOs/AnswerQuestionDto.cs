using OnlineExam.Common.Domain;
using OnlineExam.Models.Responses.QuestionResponses;

namespace OnlineExam.Models.DTOs;

public class AnswerQuestionDto : IKeyId
{
    public long Id { get; set; }
    public string Answer { get; set; }
    public bool Correct { get; set; }
}

public class AnswerSelect : AnswerQuestionDto
{
    public bool Selected { get; set; }
}