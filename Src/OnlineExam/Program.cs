using System.Text.Json.Serialization;
using OnlineExam.Common.BaseControllers;
using OnlineExam.Common.Tokens;
using OnlineExam.DependencyInjections;
using Wkhtmltopdf.NetCore;

var builder = WebApplication.CreateBuilder(args);

var jwtSecretKey = builder.Configuration.GetSection("JwtSecretKey").Get<JwtSecretKey>(); // adapt and remove duplicate inject secretkey

builder.Services
    .AddNhibernate(builder.Configuration.GetConnectionString("Default"))
    .AddAutoMapper(typeof(Program).Assembly)
    .AddAuthorization(jwtSecretKey.SecretKey)
    .AddInjection();
builder.Services
    .AddSwaggerGen()
    .AddControllersWithViews().AddJsonOptions(x =>
        x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddWkhtmltopdf();

builder.Services.Configure<JwtSecretKey>(builder.Configuration.GetSection("JwtSecretKey"));// adapt and remove duplicate inject secretkey
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
});


var app = builder.Build();


if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseDeveloperExceptionPage();
}

app.UseSwagger().UseSwaggerUI(options => options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1"));
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors();
app.UseAuthentication().UseAuthorization();
app.UseMiddleware<BaseMiddleware>();
app.UseMiddleware<MiddlewareInsertUnique>();


app.MapControllerRoute(
    name: "default",
    pattern: "api/{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();