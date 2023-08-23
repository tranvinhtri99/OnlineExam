using AutoMapper;
using NUnit.Framework;
using OnlineExam.Mappings.AutoMappers;

namespace OnlineExam.Tests;

public class MapperTest
{

    [Test]
    public void AutoMapperTest()
    {
        var _mapper = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile(typeof(DomainMapperProfile));
        });
        
        _mapper.AssertConfigurationIsValid();
    }
}