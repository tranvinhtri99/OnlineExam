using OnlineExam.Common.Domain;

namespace OnlineExam.Models.Domain;

public class Subject : BaseDomain
{
    public virtual long Code { get; set; }
    public virtual string Name { get; set; }
    public virtual int NoCredit { get; set; }
    public  virtual IList<Question> Questions { get; set; }
    public  virtual IList<Exam> Exams { get; set; }
}