using OnlineExam.Common.Domain;

namespace OnlineExam.Models.Domain;

public class Classroom : BaseDomain
{
    public virtual string Name { get; set; }
    public virtual IList<Student> Students { get; set; }
}