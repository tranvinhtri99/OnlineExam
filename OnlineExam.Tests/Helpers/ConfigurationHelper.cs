using Microsoft.Extensions.Configuration;

namespace OnlineExam.Tests.Helpers;

public class ConfigurationHelper
{
    public static IConfiguration InitConfiguration(string file = "appsettings.Development.json")
    {
        var config = new ConfigurationBuilder()
            .AddJsonFile(file)
            .AddEnvironmentVariables() 
            .Build();
        return config;
    }
}