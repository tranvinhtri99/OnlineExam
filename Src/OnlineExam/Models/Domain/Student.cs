using OnlineExam.Common.Domain;

namespace OnlineExam.Models.Domain;

public class Student : Account
{
    public virtual Classroom Classroom { get; set; }
    public virtual IList<Score> Scores { get; set; }
    public virtual IList<Exam> Exams { get; set; }
}