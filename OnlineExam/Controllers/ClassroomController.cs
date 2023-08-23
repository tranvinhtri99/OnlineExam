using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineExam.Common.BaseControllers;
using OnlineExam.Models.DTOs;
using OnlineExam.Models.Requests.ClassroomRequest;
using OnlineExam.Services;

namespace OnlineExam.Controllers;

// [Authorize]
public class ClassroomController : BaseController
{
    private readonly ClassroomService _service;

    public ClassroomController(ClassroomService service)
    {
        _service = service;
    }

    [HttpGet]
    public Task<IList<ClassroomDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return _service.GetAllAsync(cancellationToken);
    }
    
    [HttpGet("{id:long}")]
    public Task<ClassroomWithStudentDto> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return _service.GetByIdAsync(id, cancellationToken);
    }

    [HttpPost]
    public Task<ClassroomDto> CreateClassroomAsync(CreateClassroomDto classroomDto, CancellationToken cancellationToken = default)
    {
        return _service.CreateClassroomAsync(classroomDto, cancellationToken);
    }

    [HttpPut]
    public Task<ClassroomDto> UpdateClassroomAsync(UpdateClassroomDto updateClassroomDto, CancellationToken cancellationToken = default)
    {
        return _service.UpdateClassroomAsync(updateClassroomDto, cancellationToken);
    }

    [HttpDelete("{id:long}")]
    public Task<bool> DeleteClassroomAsync(long id, CancellationToken cancellationToken = default)
    {
        return _service.DeleteClassroomAsync(id, cancellationToken);
    }
}