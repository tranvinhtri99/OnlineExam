using OnlineExam.Common.Domain;
using OnlineExam.Models.Domain;

namespace OnlineExam.Models.DTOs;

public class SubjectDto : BaseDomainDto
{
    public long Code { get; set; }
    public string Name { get; set; }
    public int NoCredit { get; set; }
    
}