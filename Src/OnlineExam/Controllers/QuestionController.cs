using Microsoft.AspNetCore.Mvc;
using OnlineExam.Common.BaseControllers;
using OnlineExam.Models.Requests.ExamRequest;
using OnlineExam.Models.Requests.QuestionRequest;
using OnlineExam.Models.Responses.QuestionResponses;
using OnlineExam.Services;

namespace OnlineExam.Controllers;

public class QuestionController : BaseController
{
    private readonly QuestionService _service;

    public QuestionController(QuestionService service)
    {
        _service = service;
    }
    
    [HttpGet]
    public Task<IList<QuestionDto>> GetAllAsync(string? search = null, CancellationToken cancellationToken = default)
    {
        return _service.GetAllAsync(search, cancellationToken);
    }
    
    [HttpGet("{id:long}")]
    public Task<QuestionDto> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return _service.GetByIdAsync(id, cancellationToken);
    }

    [HttpGet("CountQuestion/{id:long}")]
    public Task<IList<LevelQuestion>> CountQuestionWithLevelAsync(long id, CancellationToken cancellationToken = default)
    {
        return _service.GetLevelQuestionAsync(id, cancellationToken);
    }

    [HttpPost]
    public Task<QuestionDto> CreateQuestionAsync(CreateQuestionDto questionDto, CancellationToken cancellationToken = default)
    {
        return _service.CreateQuestionAsync(questionDto, cancellationToken);
    }

    [HttpPut]
    public Task<QuestionDto> UpdateQuestionAsync(UpdateQuestionDto updateQuestionDto, CancellationToken cancellationToken = default)
    {
        return _service.UpdateQuestionAsync(updateQuestionDto, cancellationToken);
    }

    [HttpDelete("{id:long}")]
    public Task<bool> DeleteQuestionAsync(long id, CancellationToken cancellationToken = default)
    {
        return _service.DeleteQuestionAsync(id, cancellationToken);
    }
}