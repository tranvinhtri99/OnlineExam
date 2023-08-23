using OnlineExam.Common.Enums;
using OnlineExam.Common.Exceptions;

namespace OnlineExam.Models.Requests.QuestionRequest;

public class CreateQuestionDto
{
    public TypeQuestion Type { get; set; }
    public string Text { get; set; }
    public int Level { get; set; }
    public IList<CreateAnswerQuestionDto> Answers { get; set; }
    public long SubjectId { get; set; }
    public void ValidateAnswer()
    {
        if (Answers.Count < 2) throw new AnswerQuestionException("A question must have at least 2 answer");
        
        if (Answers.All(x => x.Correct == false)) throw new AnswerQuestionException("A question must have at least 1 correct answer");

        for (var i = 0; i < Answers.Count - 1; i++)
        for (var j = i + 1; j < Answers.Count; j++)
            if (Answers[i].Answer == Answers[j].Answer)
                throw new DuplicateException("duplicate answer in a question");
    }
}