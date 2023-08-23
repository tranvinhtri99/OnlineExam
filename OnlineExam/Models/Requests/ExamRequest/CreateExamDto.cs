namespace OnlineExam.Models.Requests.ExamRequest;

public class CreateExamDto
{
    public virtual string Name { get; set; }
    public virtual DateTime Start { get; set; }
    public virtual int Time { get; set; }
    
    public virtual long SubjectId { get; set; }
    public virtual IList<LevelQuestion> LevelQuestions { get; set; }
    public virtual IList<long> ClassroomsId { get; set; }
}

public class LevelQuestion
{
    public int Key { get; set; }
    public int Value { get; set; }
}