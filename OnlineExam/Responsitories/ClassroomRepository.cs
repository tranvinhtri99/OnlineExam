using OnlineExam.Common.Repositories;
using OnlineExam.Models.Domain;

namespace OnlineExam.Responsitories;

public class ClassroomRepository : BaseRepository<Classroom>
{

    public async Task<IList<Student>> GetStudentByClassroomIdAsync(long[] classroomsId,
        CancellationToken cancellationToken = default)
    {
        return await Session.QueryOver<Student>()
            .AndRestrictionOn(x => x.Classroom.Id).IsIn(classroomsId)
            .ListAsync(cancellationToken);
    }
}