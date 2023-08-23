using OnlineExam.Common.Domain;

namespace OnlineExam.Models.Domain;

public class Exam : BaseDomain
{
    public virtual string Name { get; set; }
    public virtual DateTime Start { get; set; }
    public virtual int Time { get; set; }
    
    public virtual Subject Subject { get; set; }
    public virtual IList<Question> Questions { get; set; }
    public virtual IList<Student> Students { get; set; }
    public virtual IList<Score> Scores { get; set; }
}