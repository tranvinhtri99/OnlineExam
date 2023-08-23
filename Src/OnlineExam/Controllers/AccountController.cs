using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineExam.Common.BaseControllers;
using OnlineExam.Models.DTOs;
using OnlineExam.Models.Requests.AccountRequest;
using OnlineExam.Services;

namespace OnlineExam.Controllers;

[Authorize]
public class AccountController : BaseController
{
    private readonly AccountService _service;


    public AccountController(AccountService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<object[]> GetAllAccount(CancellationToken cancellationToken = default)
    {
        var result = (object[])(await _service.GetAllAccountAsync(cancellationToken)).ToArray();
        return result;
    }

    [HttpGet("student")]
    public async Task<IList<StudentDto>> GetAllStudent(CancellationToken cancellationToken = default)
    {
        return (await _service.GetAllAccountAsync(cancellationToken)).Where(x => x is StudentDto).Cast<StudentDto>().ToList();
    }

    [HttpPost("student")]
    public Task<StudentDto> CreateStudentAsync(CreateStudentDto studentDto, CancellationToken cancellationToken = default)
    {
        return _service.CreateStudentAsync(studentDto, cancellationToken);
    }
    
    [HttpPost("lecturer")]
    public Task<LecturerDto> CreateLecturerAsync(CreateLecturerDto lecturerDto, CancellationToken cancellationToken = default)
    {
        return _service.CreateLecturerAsync(lecturerDto, cancellationToken);
    }

    [HttpPost("resetpassword")]
    public async Task<string> ResetPassword(long id, CancellationToken cancellationToken = default)
    {
        return await _service.ResetPasswordAsync(id, cancellationToken);
    }

    [HttpPost("updatepassword")]
    public async Task<string> UpdatePassword(long id, string pass, CancellationToken cancellationToken = default)
    {
        return await _service.UpdatePasswordAsync(id, pass, cancellationToken);
    }

    [HttpDelete("{id:long}")]
    public Task<bool> DeleteAccountAsync(long id, CancellationToken cancellationToken = default)
    {
        return _service.DeleteAccountAsync(id, cancellationToken);
    }
    
    [HttpPut("student")]
    public Task<StudentDto> UpdateStudentAsync(UpdateStudentDto updateStudentDto, CancellationToken cancellationToken = default)
    {
        return _service.UpdateStudentAsync(updateStudentDto, cancellationToken);
    }
    
    [HttpPut("lecturer")]
    public Task<LecturerDto> UpdateStudentAsync(UpdateLecturerDto updateLecturerDto, CancellationToken cancellationToken = default)
    {
        return _service.UpdateLecturerAsync(updateLecturerDto, cancellationToken);
    }
    
}