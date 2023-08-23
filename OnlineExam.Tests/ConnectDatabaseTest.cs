using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using NHibernate;
using NHibernate.Tool.hbm2ddl;
using NUnit.Framework;
using OnlineExam.Common.Helpers;
using OnlineExam.Models.Domain;
using OnlineExam.Tests.Helpers;

namespace OnlineExam.Tests;

public class ConnectDatabaseTest
{
    private ISession _session;
    private ITransaction _transaction;
    
    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        var config = ConfigurationHelper.InitConfiguration();
        var connectionString = config.GetConnectionString("Default");
        
        var configuration = NHibernateHelper.GetConfigurationNHibernate(connectionString);
        var schema = new SchemaExport(configuration);

        schema.Drop(true, true);
        schema.Execute(true, true, false);
        var factory = configuration.BuildSessionFactory();
        _session = factory.OpenSession();
        _transaction = _session.BeginTransaction();
    }

    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        _transaction.Commit();
        _transaction.Dispose();
        _session.Dispose();
    }

    [Test]
    public void GeneratorAccountAdmin()
    {
        Admin admin = new Admin()
        {
            Username = "Admin",
            Name = "Trần Vĩnh Trí",
            Password = "15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225"
        };
        _session.Save(admin);
    }
    
}