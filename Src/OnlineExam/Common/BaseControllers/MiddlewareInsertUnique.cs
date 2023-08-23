using System.Data.SqlClient;
using NHibernate;
using NHibernate.Exceptions;
using OnlineExam.Common.Exceptions;
using OnlineExam.Common.Models;
using OnlineExam.Common.Resources;

namespace OnlineExam.Common.BaseControllers;

public class MiddlewareInsertUnique
{
    private readonly RequestDelegate _next;

    public MiddlewareInsertUnique(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var currentBody = context.Response.Body;

        using (var memoryStream = new MemoryStream())
        {
            context.Response.Body = memoryStream;

            try
            {
                await _next(context);
                context.Response.Body = currentBody;

                memoryStream.Seek(0, SeekOrigin.Begin);
                await memoryStream.CopyToAsync(currentBody);
            }
            catch (GenericADOException e)
            {
                if (e.Message.Contains("select SCOPE_IDENTITY()"))
                {
                    throw new UniqueInsertException(ErrorMessage.MessageUniqueInsert);
                }

                throw;
            }
            catch (SqlException e)
            {
                if (e.Message.Contains("UNIQUE KEY constraint"))
                {
                    throw new UniqueInsertException(ErrorMessage.MessageUniqueInsert);
                }

                throw;
            }
            catch (ObjectNotFoundException)
            {
                throw new UniqueInsertException(ErrorMessage.MessageNotFound);
            }
        }
    }
}