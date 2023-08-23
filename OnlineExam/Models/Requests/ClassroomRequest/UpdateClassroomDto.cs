using OnlineExam.Common.Domain;

namespace OnlineExam.Models.Requests.ClassroomRequest;

public class UpdateClassroomDto : IKeyId, IRowVersion
{
    public long Id { get; set; }
    public long RowVersion { get; set; }
    public string Name { get; set; }
}