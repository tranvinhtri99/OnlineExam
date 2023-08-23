using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using OnlineExam.Common.Encrypts;
using OnlineExam.Common.Helpers;
using OnlineExam.Common.Models;
using OnlineExam.Common.Tokens;
using OnlineExam.React.UnitOfWork;
using OnlineExam.Responsitories;
using OnlineExam.Services;
using RazorEngineCore;

namespace OnlineExam.DependencyInjections;

public static class DependencyInjectionExtension
{
    public static IServiceCollection AddNhibernate(this IServiceCollection services,string connectionString)
    {
        var sessionFactory = NHibernateHelper.GetSessionFactory(connectionString);
        services.AddSingleton(sessionFactory);
        services.AddSingleton<IUnitOfWorkProvider, UnitOfWorkProvider>();
        return services;
    }
    
    public static IServiceCollection AddInjection(this IServiceCollection service)
    {
        #region Repositories

        service.AddTransient<AccountRepository>();
        service.AddTransient<ClassroomRepository>();
        service.AddTransient<SubjectRepository>();
        service.AddTransient<QuestionRepository>();
        service.AddTransient<ExamRepository>();
        service.AddTransient<AnswerRepository>();
        service.AddTransient<ScoreRepository>();

        #endregion
        
        #region Services

        service.AddTransient<AuthenticationService>();
        service.AddTransient<AccountService>();
        service.AddTransient<SubjectService>();
        service.AddTransient<ClassroomService>();
        service.AddTransient<QuestionService>();
        service.AddTransient<ExamService>();
        service.AddTransient<ScoreService>();

        #endregion

        service.AddTransient<JwtManagement>();
        service.AddSingleton<IRazorEngine, RazorEngine>();
        

        return service;
    }

    public static IServiceCollection AddAuthorization(this IServiceCollection service, string secretKey)
    {
        
        service.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(x =>
        {
            x.RequireHttpsMetadata = false;
            x.SaveToken = true;
            x.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey.ToSha256())),
                ValidateIssuer = false,
                ValidateAudience = false,
            };

            x.Events = new JwtBearerEvents()
            {
                OnChallenge = async context =>
                {
                    context.HandleResponse();
            
                    if (!context.Response.HasStarted)
                    {
                        context.Response.StatusCode = StatusCodes.Status200OK;
                        context.Response.ContentType = "application/json";

                        var response = new BaseResponse()
                        {
                            Type = TypeResponse.BusinessException,
                            Error = new ErrorResponse()
                            {
                                Type = "Status401Unauthorized",
                                Message = "Invalid or expired token"
                            }
                        };
                        await context.Response.WriteAsJsonAsync(response);
                        await context.Response.CompleteAsync();
                    }
                    else
                    {
                        await context.Response.WriteAsync(string.Empty);
                    }
                },
            };

        });

        return service;
    }
}