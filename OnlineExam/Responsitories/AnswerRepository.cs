using OnlineExam.Common.Repositories;
using OnlineExam.Models.Domain;

namespace OnlineExam.Responsitories;

public class AnswerRepository : BaseRepository<AnswerTest>
{
    
    public Task<IList<AnswerTest>> GetAnswerTestAsync(long examId, IEnumerable<Student> studentsId, CancellationToken cancellationToken = default)
    {
        return Session.QueryOver<AnswerTest>()
            .Where(x => x.Exam.Id == examId)
            .AndRestrictionOn(x => x.Student)
            .IsInG(studentsId)
            .ListAsync(cancellationToken);
    }
}