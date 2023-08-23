using System.Linq.Expressions;
using NHibernate;
using OnlineExam.Common.Repositories;
using OnlineExam.Models.Domain;

namespace OnlineExam.Responsitories;

public class ScoreRepository : BaseRepository<Score>
{
    
    public Task<IList<Score>> GetAllScoreStudentAsync(long studentId, CancellationToken cancellationToken = default)
    {
        return Session.QueryOver<Score>()
            .Where(x => x.Student.Id == studentId)
            .Fetch(SelectMode.Fetch, x => x.Exam)
            .Fetch(SelectMode.Fetch, x => x.Exam.Subject)
            .Fetch(SelectMode.Fetch, x => x.Student)
            .ListAsync(cancellationToken);
    }

    public async Task<bool> ContainsScoreAsync(Expression<Func<Score, bool>> expression,
        CancellationToken cancellationToken = default)
    {
        return await Session.QueryOver<Score>()
            .Where(expression)
            .RowCountAsync(cancellationToken) > 0;
    }
}