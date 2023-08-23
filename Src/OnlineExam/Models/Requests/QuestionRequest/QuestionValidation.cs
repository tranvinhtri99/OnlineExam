using OnlineExam.Common.Exceptions;

namespace OnlineExam.Models.Requests.QuestionRequest;

public interface IQuestionValidation
{
    public void ValidateAnswer();
}

public static class QuestionValidation
{
    public static void ValidateAnswer(this IList<UpdateAnswerQuestionDto> answers) => ValidateAnswer((IList<IAnswerQuestion>) answers);
    public static void ValidateAnswer(this IList<CreateAnswerQuestionDto> answers) => ValidateAnswer((IList<IAnswerQuestion>) answers);
    public static void ValidateAnswer(this IList<IAnswerQuestion> answers)
    {
        if (answers.Count < 2) throw new AnswerQuestionException("A question must have at least 2 answer");
        
        if (answers.All(x => x.Correct == false)) throw new AnswerQuestionException("A question must have at least 1 correct answer");

        for (var i = 0; i < answers.Count - 1; i++)
            for (var j = i + 1; j < answers.Count; j++)
                if (answers[i].Answer == answers[j].Answer)
                    throw new DuplicateException("duplicate answer in a question");
    }
    
    
}

public interface IAnswerQuestion
{
    public string Answer { get; set; }
    public bool Correct { get; set; }
}