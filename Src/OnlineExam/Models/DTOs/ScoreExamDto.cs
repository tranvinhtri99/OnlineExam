namespace OnlineExam.Models.DTOs;

public class ScoreExamDto
{
    public virtual long Id { get; set; }
    public virtual StudentDto Student { get; set; }
    public virtual float Point { get; set; }
}