using System.Linq.Expressions;
using AutoMapper;

namespace OnlineExam.Mappings.AutoMappers;

public static class IgnoreExtention
{
    public static IMappingExpression<TSource, TDestination> Ignore<TSource, TDestination>(
        this IMappingExpression<TSource, TDestination> map,
        params Expression<Func<TDestination, object>>[] selectors)
    {
        foreach (var selector in selectors) 
        {
            map.ForMember(selector, config => config.Ignore());
        }
        return map;
    }
}