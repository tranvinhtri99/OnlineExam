using OnlineExam.Common.Domain;
using OnlineExam.Common.Enums;
using OnlineExam.Models.Domain;

namespace OnlineExam.Models.Requests.QuestionRequest;

public class QuestionTestDto : IKeyId 
{
    public long Id { get; set; }
    public TypeQuestion Type { get; set; }
    public string Text { get; set; }
    public int Level { get; set; }
    public IList<AnswerQuestionTest> Answers { get; set; }
}

public class AnswerQuestionTest
{
    public long Id { get; set; }
    public string Answer { get; set; }
    public bool Selected { get; set; }
}