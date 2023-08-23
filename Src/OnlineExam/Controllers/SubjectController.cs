using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineExam.Common.BaseControllers;
using OnlineExam.Models.DTOs;
using OnlineExam.Models.Requests.SubjectRequest;
using OnlineExam.Services;

namespace OnlineExam.Controllers;

// [Authorize]
public class SubjectController : BaseController
{
    private readonly SubjectService _service;

    public SubjectController(SubjectService service)
    {
        _service = service;
    }

    [HttpGet]
    public Task<IList<SubjectDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return _service.GetAllAsync(cancellationToken);
    }
    
    [HttpGet("{id:long}")]
    public Task<SubjectDto> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return _service.GetByIdAsync(id, cancellationToken);
    }

    [HttpPost]
    public Task<SubjectDto> CreateSubjectAsync(CreateSubjectDto subjectDto, CancellationToken cancellationToken = default)
    {
        return _service.CreateSubjectAsync(subjectDto, cancellationToken);
    }

    [HttpPut]
    public Task<SubjectDto> UpdateSubjectAsync(UpdateSubjectDto updateSubjectDto, CancellationToken cancellationToken = default)
    {
        return _service.UpdateSubjectAsync(updateSubjectDto, cancellationToken);
    }

    [HttpDelete("{id:long}")]
    public Task<bool> DeleteSubjectAsync(long id, CancellationToken cancellationToken = default)
    {
        return _service.DeleteSubjectAsync(id, cancellationToken);
    }
}