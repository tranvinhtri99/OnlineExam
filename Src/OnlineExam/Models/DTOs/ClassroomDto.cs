using OnlineExam.Common.Domain;
using OnlineExam.Models.Domain;

namespace OnlineExam.Models.DTOs;

public class ClassroomDto: BaseDomainDto
{
    public string Name { get; set; }
}

public class ClassroomWithStudentDto : ClassroomDto
{
    public IList<Student> Students { get; set; }
}