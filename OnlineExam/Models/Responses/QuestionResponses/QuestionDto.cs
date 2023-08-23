using OnlineExam.Common.Domain;
using OnlineExam.Common.Enums;
using OnlineExam.Models.Domain;
using OnlineExam.Models.DTOs;

namespace OnlineExam.Models.Responses.QuestionResponses;

public class QuestionDto : BaseDomainDto
{
    public TypeQuestion Type { get; set; }
    public string Text { get; set; }
    public int Level { get; set; }
    public IList<AnswerQuestionDto> Answers { get; set; }
    public SubjectDto Subject { get; set; }
}

public class QuestionAnswer : BaseDomainDto
{
    public TypeQuestion Type { get; set; }
    public string Text { get; set; }
    public int Level { get; set; }
    public bool Correct { get; set; } = true;
    public IList<AnswerSelect> Answers { get; set; }
}

public class QuestionExamDto : BaseDomainDto
{
    public TypeQuestion Type { get; set; }
    public string Text { get; set; }
    public int Level { get; set; }
}