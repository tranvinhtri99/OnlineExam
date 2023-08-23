using System.Net;
using System.Text;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using OnlineExam.Common.Exceptions;
using OnlineExam.Common.Models;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace OnlineExam.Common.BaseControllers;

public class BaseMiddleware
{
    private readonly RequestDelegate _next;

    public BaseMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.Value is not null && context.Request.Path.Value.Contains("export"))
        {
            await _next(context);
            return;
        }
        
        var currentBody = context.Response.Body;

        using (var memoryStream = new MemoryStream())
        {
            BaseResponse result;
            //set the current response to the memorystream.
            context.Response.Body = memoryStream;

            try
            {

                await _next(context); // .WaitAsync(TimeSpan.FromSeconds(5))

                //reset the body 
                context.Response.Body = currentBody;
                memoryStream.Seek(0, SeekOrigin.Begin);

                var readToEnd = await new StreamReader(memoryStream).ReadToEndAsync();

                var objResult = (readToEnd.Contains('[') || readToEnd.Contains('{'))
                    ? JsonSerializer.Deserialize<object>(readToEnd)
                    : readToEnd;

                result = new BaseResponse()
                {
                    Data = objResult,
                    Type = TypeResponse.Success
                };
            }
            catch (BaseBusinessException e)
            {
                result = new BaseResponse()
                {
                    Type = TypeResponse.BusinessException,
                    Error = new ErrorResponse()
                    {
                        Type = e.GetType().Name,
                        Message = e.Message
                    }
                };
            }
            catch (TimeoutException)
            {
                result = new BaseResponse()
                {
                    Type = TypeResponse.BusinessException,
                    Error = new ErrorResponse()
                    {
                        Type = nameof(TimeoutException),
                        Message = "Timeout"
                    }
                };
            }
            catch (Exception e)
            {
                result = new BaseResponse()
                {
                    Type = TypeResponse.ErrorException,
                    ErrorException = new ErrorResponse()
                    {
                        Type = e.GetType().Name,
                        Message = e.Message
                    },
                    Error = ErrorResponse.ErrorException
                };
            }
            context.Response.Body = currentBody;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(JsonSerializer.Serialize(result));
        }
    }
    // } public async Task InvokeAsync(HttpContext context)
    // {
    //     try
    //     {
    //         await using var memStream = new MemoryStream();
    //         BaseResponse baseResponse;
    //         context.Response.Body = memStream;
    //         try
    //         {
    //             await _next(context);
    //             memStream.Position = 0;
    //             var responseBody = await new StreamReader(memStream).ReadToEndAsync();
    //             var data = JsonSerializer.Deserialize<object>(responseBody);
    //             baseResponse = new BaseResponse()
    //             {
    //                 Type = TypeResponse.Success,
    //                 Data = data
    //             };
    //         }
    //         catch (BaseBusinessException e)
    //         {
    //             baseResponse = new BaseResponse()
    //             {
    //                 Error = new ErrorResponse()
    //                 {
    //                     Type = e.GetType().Name,
    //                     Message = e.Message
    //                 }
    //             };
    //         } catch (Exception e)
    //         {
    //             baseResponse = new BaseResponse()
    //             {
    //                 ErrorException = new ErrorResponse()
    //                 {
    //                     Type = e.GetType().Name,
    //                     Message = e.Message
    //                 },
    //                 Error = ErrorResponse.ErrorException
    //             };
    //         }
    //
    //         // context.Response.Body.Position = 0;
    //
    //         var json = JsonSerializer.Serialize(baseResponse);
    //         var buffer = Encoding.UTF8.GetBytes(json);
    //         await context.Response.Body.WriteAsync(buffer);
    //     }
    //     catch (Exception e)
    //     {
    //         await using (context.Response.Body = new MemoryStream())
    //         {
    //             var baseResponse = new BaseResponse()
    //             {
    //                 ErrorException = new ErrorResponse()
    //                 {
    //                     Type = e.GetType().Name,
    //                     Message = e.Message
    //                 },
    //                 Error = ErrorResponse.ErrorException
    //             };
    //             await context.Response.WriteAsJsonAsync(baseResponse);
    //         }
    //     }
}