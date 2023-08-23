using NHibernate;
using NHibernate.Cfg;
using NHibernate.Connection;
using NHibernate.Dialect;
using NHibernate.Driver;
using NHibernate.Mapping;
using NHibernate.Mapping.ByCode;
using OnlineExam.Mappings.ClassMappings;

namespace OnlineExam.Common.Helpers;

public class NHibernateHelper
{
    public static ISessionFactory GetSessionFactory(string connectionString)
    {
        var config = GetConfigurationNHibernate(connectionString);
        return config.BuildSessionFactory();
    }
    
    public static Configuration GetConfigurationNHibernate(string connectionString)
    {
        var config = new Configuration().DataBaseIntegration(x =>
        {
            x.ConnectionString = connectionString;
            x.ConnectionProvider<DriverConnectionProvider>();
            x.Dialect<MsSql2012Dialect>();
            x.Driver<SqlClientDriver>();
            x.LogSqlInConsole = true;
            x.LogFormattedSql = true;
            x.AutoCommentSql = true;
            x.Timeout = 10;
            x.BatchSize = 50;
        });

        // config.AddAuxiliaryDatabaseObject(new SimpleAuxiliaryDatabaseObject("", ""));

        var mapper = new ModelMapper();
        mapper.AddMapping<QuestionMap>();
        mapper.AddMappings(typeof(Program).Assembly.GetTypes());
        var mapping = mapper.CompileMappingForAllExplicitlyAddedEntities();
        config.AddMapping(mapping);

        return config;
    }
}