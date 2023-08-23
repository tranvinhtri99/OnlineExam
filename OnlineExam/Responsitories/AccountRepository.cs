using NHibernate;
using OnlineExam.Common.Domain;
using OnlineExam.Common.Repositories;
using OnlineExam.React.UnitOfWork;
using OnlineExam.Models.Domain;

namespace OnlineExam.Responsitories;

public class AccountRepository : BaseRepository<Account>
{
    public async Task<Account> GetAccountAsync(string username, string passwordHash,
        CancellationToken cancellationToken = default)
    {
        var account =await GetSingleAsync(x => x.Username == username && x.Password == passwordHash, cancellationToken);
        if (account is Student student)
        {
            await NHibernateUtil.InitializeAsync(student.Classroom, cancellationToken);
        }

        return account;
    }
        

    public async Task<Account> SetPasswordAsync(long id, string passwordHash, CancellationToken cancellationToken = default)
    {
        var account = await GetByIdAsync(id, cancellationToken);
        account.Password = passwordHash;

        return account;
    }

    public Task<IList<Student>> GetAllStudentClassroomAsync(long classroomId, CancellationToken cancellationToken = default)
    {
        return Session.QueryOver<Student>()
            .Where(x => x.Classroom.Id == classroomId)
            .ListAsync(cancellationToken);
    }
}