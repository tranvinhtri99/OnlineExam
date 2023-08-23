using OnlineExam.Common.Domain;

namespace OnlineExam.Models.Requests.SubjectRequest;

public class UpdateSubjectDto : IKeyId, IRowVersion
{
    public long Id { get; set; }
    public long RowVersion { get; set; }
    public virtual long Code { get; set; }
    public virtual string Name { get; set; }
    public virtual int NoCredit { get; set; }
}