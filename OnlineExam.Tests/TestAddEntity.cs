using Microsoft.Extensions.Configuration;
using NHibernate;
using NHibernate.Tool.hbm2ddl;
using NUnit.Framework;
using OnlineExam.Common.Enums;
using OnlineExam.Common.Helpers;
using OnlineExam.Mappings.ClassMappings;
using OnlineExam.Models.Domain;
using OnlineExam.Tests.Helpers;

namespace OnlineExam.Tests;

public class TestAddEntity
{
    private ISession _session;
    private ITransaction _transaction;
    
    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        var config = ConfigurationHelper.InitConfiguration();
        var connectionString = config.GetConnectionString("Default");
        
        var configuration = NHibernateHelper.GetConfigurationNHibernate(connectionString);
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

    private void GeneratorData()
    {
        
    }

    [Test]
    public void AddAnswerQuestion_HasSameData_ShouldThrowException()
    {
        Question question = new Question()
        {
            Text = "1 + 1 = ?",
            Type = TypeQuestion.Quiz,
        };
        _session.Save(question);
        _session.Flush();

        AnswerQuestion answerQuestion1 = new AnswerQuestion()
        {
            Question = question,
            Answer = "2"
        };

        AnswerQuestion answerQuestion2 = new AnswerQuestion()
        {
            Question = question,
            Answer = "2"
        };
        

        _session.Save(answerQuestion1);
        _session.Save(answerQuestion2);
        _transaction.Commit();
    }
}