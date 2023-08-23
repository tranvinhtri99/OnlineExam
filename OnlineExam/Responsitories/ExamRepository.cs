using NHibernate;
using NHibernate.Criterion;
using NHibernate.Hql.Ast.ANTLR.Tree;
using OnlineExam.Common.Repositories;
using OnlineExam.React.UnitOfWork;
using OnlineExam.Models.Domain;
using NHibernate.Transform;

namespace OnlineExam.Responsitories;

public class ExamRepository : BaseRepository<Exam>
{

    public void GetListExamAsync(CancellationToken cancellationToken = default)
    {
        Session.QueryOver<Exam>();
    }
    public async Task<Exam> GetExamByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        // Code này chưa test.
        return await Session.QueryOver<Exam>()
            .Where(x => x.Id == id)
            .TransformUsing(new DistinctRootEntityResultTransformer())
            .SingleOrDefaultAsync();


        //var exam = await Session.GetAsync<Exam>(id, cancellationToken);
        //await NHibernateUtil.InitializeAsync(exam.Subject, cancellationToken);
        //await NHibernateUtil.InitializeAsync(exam.Students, cancellationToken);
        //await NHibernateUtil.InitializeAsync(exam.Scores, cancellationToken);
        //await NHibernateUtil.InitializeAsync(exam.Questions, cancellationToken);
        //foreach (var student in exam.Students)
        //{
        //    await NHibernateUtil.InitializeAsync(student.Classroom, cancellationToken); // Chỗ này cũng n+1
        //}
        //return exam;
    }

    public async Task<IList<Exam>> GetListExamJoinAsync(long studentId, CancellationToken cancellationToken = default)
    {
        //Exam exam = null;

        //Session.QueryOver<Student>()
        //    .JoinAlias(x => x.Exams, () => exam)
        //    .Fetch(SelectMode.Fetch, () => exam.Subject)
        //    .Where(x => x.Id == studentId)
        //    .And(() => exam.Start + TimeSpan.FromMinutes(exam.Time) > DateTime.Now);


        //// TODO: Apdate this method return all exam can join for student (exam don't have score and have time invalid)
        //return new List<Exam>();
        // Dùng thì được nhưng câu SQL k được tốt thôi.
        var student = await Session.GetAsync<Student>(studentId, cancellationToken);
        if (student is null)
        {
            return new List<Exam>();
        }
        await NHibernateUtil.InitializeAsync(student.Exams, cancellationToken);
        foreach (var exam in student.Exams)
        {
            await NHibernateUtil.InitializeAsync(exam.Subject, cancellationToken); // Lỗi truy vấn n+1
        }

        var examIdSubmitted = student.Scores.Select(x => x.Exam.Id);

        return student.Exams.Where(x => x.Start + TimeSpan.FromMinutes(x.Time) > DateTime.Now)
            .Where(x => !examIdSubmitted.Contains(x.Id))
            .OrderBy(x => x.Start).ToList();
    }
}