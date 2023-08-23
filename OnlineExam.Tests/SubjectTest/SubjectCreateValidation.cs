using System.Net.Http;
using Microsoft.Extensions.Configuration;
using NHibernate;
using NHibernate.Tool.hbm2ddl;
using NHibernate.Validator.Event;
using NUnit.Framework;
using OnlineExam.Common.Helpers;
using OnlineExam.Models.Domain;
using OnlineExam.Tests.Helpers;

namespace OnlineExam.Tests.SubjectTest;

public class SubjectCreateValidation
{
    private ISessionFactory _factory;
    
    private ISession _session;
    private ITransaction _transaction;
    
    [OneTimeSetUp]
    public void OneTimeSetup()
    {
        var config = ConfigurationHelper.InitConfiguration();
        var connectionString = config.GetConnectionString("Default");
        
        var configuration = NHibernateHelper.GetConfigurationNHibernate(connectionString);

        _factory = configuration.BuildSessionFactory();
        
    }

    [SetUp]
    public void SetUp()
    {
        _session = _factory.OpenSession();
        _transaction = _session.BeginTransaction();
    }

    [TearDown]
    public void TearDown()
    {
        _transaction.Commit();
        _transaction.Dispose();
        _session.Dispose();
    }

    [Test]
    public void SubjectCreate_Validation_Fail()
    {
        Subject subject = new Subject()
        {
            Code = 123123123,
            Name = "Môn gì đó",
            NoCredit = 25
        };
        _session.Save(subject);
    }
}