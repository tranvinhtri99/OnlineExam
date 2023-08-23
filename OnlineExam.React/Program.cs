using OnlineExam.Common.BaseControllers;
using OnlineExam.Common.Tokens;
using OnlineExam.DependencyInjections;
using OnlineExam.Mappings.AutoMappers;
using System.Text.Json.Serialization;
using Wkhtmltopdf.NetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews().AddJsonOptions(x =>
        x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddSwaggerGen();

var jwtSecretKey = builder.Configuration.GetSection("JwtSecretKey").Get<JwtSecretKey>();

builder.Services
    .AddNhibernate(builder.Configuration.GetConnectionString("Default"))
    .AddAutoMapper(typeof(Program).Assembly)
    .AddAuthorization(jwtSecretKey.SecretKey)
    .AddInjection();
builder.Services
    .AddSwaggerGen()
    .AddControllersWithViews().AddJsonOptions(x =>
        x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddAutoMapper(typeof(DomainMapperProfile)); // ranhr thif docj theem veef IoC

builder.Services.AddWkhtmltopdf();

builder.Services.Configure<JwtSecretKey>(builder.Configuration.GetSection("JwtSecretKey"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication().UseAuthorization();
app.UseMiddleware<BaseMiddleware>();
//app.UseMiddleware<MiddlewareInsertUnique>(); // TODO: Using new version UnitOfWork and remove _MiddlewareInsertUnique_


app.MapControllerRoute(
    name: "default",
    pattern: "api/{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
