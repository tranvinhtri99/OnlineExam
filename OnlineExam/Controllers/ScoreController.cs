using Microsoft.AspNetCore.Mvc;
using OnlineExam.Common.BaseControllers;
using OnlineExam.Models.Requests.ScoreRequests;
using OnlineExam.Services;

namespace OnlineExam.Controllers;

public class ScoreController : BaseController
{
    private readonly ScoreService _service;

    public ScoreController(ScoreService service)
    {
        _service = service;
    }

    [HttpGet]
    public Task<IList<ScoreViewDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var id = GetAccountId();
        return _service.GetAllScoreStudentAsync(id, cancellationToken);
    }
}