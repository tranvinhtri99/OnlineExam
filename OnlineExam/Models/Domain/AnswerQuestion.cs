using OnlineExam.Common.Domain;

namespace OnlineExam.Models.Domain;

public class AnswerQuestion : IKeyId
{
    public virtual long Id { get; set; }
    public virtual Question Question { get; set; }
    public virtual string Answer { get; set; }
    public virtual bool Correct { get; set; }
}