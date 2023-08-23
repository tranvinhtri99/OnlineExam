using OnlineExam.Common.Domain;

namespace OnlineExam.Models.Domain;

public class Score : IKeyId
{
    public virtual long Id { get; set; }
    public virtual Student Student { get; set; }
    public virtual Exam Exam { get; set; }
    public virtual float Point { get; set; }
}