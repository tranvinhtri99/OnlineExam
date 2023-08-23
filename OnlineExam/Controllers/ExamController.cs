using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineExam.Common.BaseControllers;
using OnlineExam.Common.Tokens;
using OnlineExam.Models.Domain;
using OnlineExam.Models.DTOs;
using OnlineExam.Models.Requests.ExamRequest;
using OnlineExam.Models.Requests.QuestionRequest;
using OnlineExam.Models.Requests.ScoreRequests;
using OnlineExam.Services;

namespace OnlineExam.Controllers;

public class ExamController : BaseController
{
    private readonly ExamService _service;
    private readonly JwtManagement _jwt; 

    public ExamController(ExamService service, JwtManagement jwt)
    {
        _service = service;
        _jwt = jwt;
    }
    

    [HttpGet]
    public Task<IList<ExamListDto>> GetAllExamAsync(CancellationToken cancellationToken = default)
    {
        return _service.GetAllAsync(cancellationToken);
    }

    [HttpGet("{id:long}")]
    public Task<ExamScoreDto> GetExamByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return _service.GetByIdAsync(id, cancellationToken);
    }

    [HttpDelete("{id:long}")]
    public Task<bool> DeleteExamAsync(long id, CancellationToken cancellationToken = default)
    {
        return _service.DeleteExamAsync(id, cancellationToken);
    }

    [HttpPost]
    public Task<ExamListDto> CreateExamAsync(CreateExamDto examDto, CancellationToken cancellationToken = default)
    {
        return _service.CreateExamAsync(examDto, cancellationToken);
    }

    

    [HttpPost("addStudent")]
    public Task<StudentDto> AddStudentExamAsync(ExamStudentRequest addStudentExam, CancellationToken cancellationToken = default)
    {
        return _service.AddStudentAsync(addStudentExam.ExamId, addStudentExam.StudentId, cancellationToken);
    }
    
    [HttpPost("removeStudent")]
    public Task<bool> RemoveStudentExamAsync(ExamStudentRequest removeStudentExam, CancellationToken cancellationToken = default)
    {
        return _service.RemoveStudentAsync(removeStudentExam.ExamId, removeStudentExam.StudentId, cancellationToken);
    }

    [HttpGet("calculateScore")]
    public void CalculateScore(CancellationToken cancellationToken = default)
    {
        
    }

    [HttpGet("export/list/{id:long}/{classroomId:long?}")]
    public Task<IActionResult> PrintListAsync(long id, long classroomId = 0, CancellationToken cancellationToken = default)
    {
        return _service.CreatePdfPrintListAsync(id, classroomId, cancellationToken);
    }
    
    [HttpGet("export/listExcel/{id:long}/{classroomId:long?}")]
    public Task<FileContentResult> ExportListExcelAsync(long id,long classroomId = 0, CancellationToken cancellationToken = default)
    {
        return _service.CreateExcelListAsync(id, classroomId, cancellationToken);
    }
    
    [HttpGet("export/examTest/{id:long}/{classroomId:long?}")]
    public Task<IActionResult> PrintExamTestAsync(long id,long classroomId, CancellationToken cancellationToken = default)
    {
        return _service.CreatePdfExamTestAsync(id, classroomId, cancellationToken);
    }

    [HttpGet("examJoin")]
    public Task<IList<ExamJoinTestDto>> GetExamJoinAsync(CancellationToken cancellationToken = default)
    {
        var id = GetAccountId();
        if (id == 0)
        {
            throw new UnauthorizedAccessException();
        }

        return _service.GetExamJoinAsync(id, cancellationToken);
    }
    
    [HttpGet("examtest/{id:long}")]
    public Task<ExamTestDto> GetExamTestAsync(long id, CancellationToken cancellationToken = default)
    {
        var studentId = GetAccountId();
        return _service.GetExamTestAsync(id, studentId, cancellationToken);
    }

    [HttpPost("examSubmit/{id:long}")]
    public async Task<ScoreDto> SubmitExamAsync(long id, IList<QuestionTestDto> questionsTest, CancellationToken cancellationToken = default)
    {
        var studentId = GetAccountId();
        return await _service.SubmitExamAsync(id, studentId, questionsTest, cancellationToken);
    }
}