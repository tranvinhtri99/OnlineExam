using OnlineExam.Models.Domain;

namespace OnlineExam.Models.DTOs;

public class StudentDto : AccountDto
{
    public ClassroomDto? Classroom { get; set; } 
}

public class StudentWithScoreDto : StudentDto
{
    public float? Score { get; set; }
}