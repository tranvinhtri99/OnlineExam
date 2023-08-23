using OnlineExam.Common.Domain;
using OnlineExam.Common.Enums;
using OnlineExam.Models.Requests.QuestionRequest;

namespace OnlineExam.Models.Domain;

public class Question : BaseDomain
{
    public virtual TypeQuestion Type { get; set; }
    public virtual string Text { get; set; }
    public virtual int Level { get; set; }
    public virtual IList<AnswerQuestion> Answers { get; set; }
    public virtual Subject Subject { get; set; }

    public virtual void AddAnswer(AnswerQuestion answerQuestion)
    {
        answerQuestion.Question = this;
        Answers ??= new List<AnswerQuestion>();
        Answers.Add(answerQuestion);
    }

    public virtual bool IsAnswerQuestionCorrect(QuestionTestDto questionTest)
    {
        var idCorrectAnswers = Answers.Where(x => x.Correct).Select(x => x.Id).ToList();
        var idTestAnswers = questionTest.Answers.Where(x => x.Selected).Select(x => x.Id).ToList();

        if (idCorrectAnswers.Count != idTestAnswers.Count)
        {
            return false;
        }

        // if correct - test has data => correct not the same test => answer wrong.
        return !idCorrectAnswers.Except(idTestAnswers).Any();
    }
}