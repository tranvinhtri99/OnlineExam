namespace OnlineExam.Common.Domain;

public class BaseDomain : IKeyRowVersion
{
    public virtual long Id { get; set; }
    public virtual long RowVersion { get; set; }
}

public class BaseDomainDto : IKeyRowVersion
{
    public long Id { get; set; }
    public long RowVersion { get; set; }
}