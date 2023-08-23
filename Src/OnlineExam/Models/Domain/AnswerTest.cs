using OnlineExam.Common.Domain;

namespace OnlineExam.Models.Domain;

public class AnswerTest : IKeyId
{
    public virtual long Id { get; set; }
    public virtual Student Student { get; set; }
    public virtual Exam Exam { get; set; }
    public virtual AnswerQuestion AnswerQuestion { get; set; }
}