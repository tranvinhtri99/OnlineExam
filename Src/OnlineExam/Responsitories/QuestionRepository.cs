using NHibernate;
using NHibernate.Criterion;
using OnlineExam.Common.Repositories;
using OnlineExam.React.UnitOfWork;
using OnlineExam.Models.Domain;
using OnlineExam.Models.Exceptions;

namespace OnlineExam.Responsitories;

public class QuestionRepository : BaseRepository<Question>
{
    public Task<IList<Question>> GetAllQuestionAsync(string? contentQuestion, CancellationToken cancellationToken = default)
    {
        if (!string.IsNullOrWhiteSpace(contentQuestion))
        {
            return Session.QueryOver<Question>()
                .WhereRestrictionOn(x => x.Text).IsLike(contentQuestion, MatchMode.Anywhere)
                .Fetch(SelectMode.Fetch, x => x.Subject)
                .ListAsync(cancellationToken);
        }
        
        return Session.QueryOver<Question>()
            .Fetch(SelectMode.Fetch, x => x.Subject)
            .ListAsync(cancellationToken);
    }

    public async Task<IList<object[]>> GetLevelQuestionAsync(long subjectId, CancellationToken cancellationToken = default)
    {
        var subject = await Session.LoadAsync<Subject>(subjectId, cancellationToken);
        
        return await Session.QueryOver<Question>()
            .Where(x => x.Subject == subject)
            .SelectList(list => list
                .SelectGroup(q => q.Level)
                .SelectCount(q => q.Id))
            .ListAsync<object[]>(cancellationToken);
    }

    public async Task<IList<Question>> GetQuestionsByLevelAsync(long subjectId, int level,
        CancellationToken cancellationToken = default)
    {
        var subject = await Session.LoadAsync<Subject>(subjectId, cancellationToken);
        return await Session.QueryOver<Question>()
            .Where(x => x.Subject == subject && x.Level == level)
            .ListAsync(cancellationToken);
    }

    public async Task<Question> GetQuestionByIdAsync(long id, CancellationToken cancellationToken = default)
    {

        var question = await Session.GetAsync<Question>(id, cancellationToken);
        if (question is null) throw new NotFoundException("Not found question");
        await NHibernateUtil.InitializeAsync(question.Subject, cancellationToken);
        await NHibernateUtil.InitializeAsync(question.Answers, cancellationToken);

        return question;
    }

    public async Task SaveOrUpdateAnswerAsync(AnswerQuestion answer, CancellationToken cancellationToken = default)
    {
        if (answer.Id == 0)
        {
            await Session.SaveAsync(answer, cancellationToken);
        }
        else
        {
            await Session.UpdateAsync(answer, cancellationToken);
        }
    }

    public async Task DeleteAnswerAsync(AnswerQuestion answer, CancellationToken cancellationToken = default)
    {
        await Session.DeleteAsync(answer, cancellationToken);
    }
}