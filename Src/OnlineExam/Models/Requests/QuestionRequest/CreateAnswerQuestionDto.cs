namespace OnlineExam.Models.Requests.QuestionRequest;

public class CreateAnswerQuestionDto : IAnswerQuestion
{
    public string Answer { get; set; }
    public bool Correct { get; set; }
}
