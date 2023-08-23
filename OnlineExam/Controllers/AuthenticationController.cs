using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NHibernate.Hql.Ast.ANTLR.Tree;
using OnlineExam.Common.BaseControllers;
using OnlineExam.Models.Requests.AuthenticationRequests;
using OnlineExam.Models.Responses.AuthenticationResponses;
using OnlineExam.Services;

namespace OnlineExam.Controllers;

public class AuthenticationController : BaseController
{
    private readonly AuthenticationService _service;
    public AuthenticationController(AuthenticationService service)
    {
        _service = service;
    }
    
    [HttpGet]
    [Authorize]
    public Task<LoginReplyDto> Index(CancellationToken cancellationToken = default)
    {
        CheckTimeExpired();
        var id = GetAccountId();

        return _service.GetLoginReply(id, GetTokenNoBearer(), cancellationToken);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public Task<LoginReplyDto> LoginAsync(LoginDto loginDto, CancellationToken cancellationToken = default)
    {
        return _service.GetTokenAsync(loginDto, cancellationToken);
    }
}