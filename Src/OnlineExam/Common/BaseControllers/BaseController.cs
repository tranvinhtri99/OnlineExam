using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace OnlineExam.Common.BaseControllers;

[ApiController]
[Route("api/[controller]")]
public class BaseController : ControllerBase
{
    [NonAction]
    protected void CheckTimeExpired()
    {
        var timeExpired = User.Claims.SingleOrDefault(x => x.Type == "exp")?.Value ?? "0";
        var time = int.Parse(timeExpired);
        if (time < DateTimeOffset.Now.AddHours(1).ToUnixTimeSeconds())
        {
            throw new UnauthorizedAccessException();
        }
    }

    [NonAction]
    protected long GetAccountId()
    {
        var userId = User.Claims.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value ?? "0";
        var id = long.Parse(userId);
        if (id <= 0)
        {
            throw new UnauthorizedAccessException();
        }
        return id;
    }

    [NonAction]
    protected string GetTokenNoBearer()
    {
        return Request.Headers[HeaderNames.Authorization].ToString()[7..];
    }
}