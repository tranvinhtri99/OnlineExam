using System.Linq.Expressions;
using OnlineExam.Common.Domain;
using OnlineExam.Common.Exceptions;
using OnlineExam.React.UnitOfWork;
using OnlineExam.Models.Exceptions;
using ISession = NHibernate.ISession;

namespace OnlineExam.Common.Repositories;

public abstract class BaseRepository<T> where T : class, IKeyId
{
    public IUnitOfWorkScope UnitOfWork => UnitOfWorkScope.Current;

    public ISession Session => UnitOfWork.Session ?? throw new Exception("No Session");

    public async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        try
        {
            await Session.SaveAsync(entity, cancellationToken);
            return entity;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<T> LoadByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return await Session.LoadAsync<T>(id, cancellationToken);
    }

    public async Task<U> LoadByIdAsync<U>(long id, CancellationToken cancellationToken = default)
    {
        return await Session.LoadAsync<U>(id, cancellationToken);
    }

    public async Task<U> GetByIdAsync<U>(long id, CancellationToken cancellationToken = default)
    {
        return await Session.GetAsync<U>(id, cancellationToken);
    }

    public async Task<T> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return await Session.GetAsync<T>(id, cancellationToken);
    }

    public async Task<T> GetAndCheckVersionAsync<U>(U entityDto, CancellationToken cancellationToken = default)
        where U : IKeyId
    {
        var entity = await Session.GetAsync<T>(entityDto.Id, cancellationToken);
        if (entity is IRowVersion entityVersion && entityDto is IRowVersion entityDtoVersion)
        {
            if (entityVersion.RowVersion != entityDtoVersion.RowVersion)
            {
                throw new VersionMismatchException("Object has been changed");
            }
        }

        return entity;
    }

    public Task<T> GetFirstAsync(Expression<Func<T, bool>> expression, CancellationToken cancellationToken = default)
    {
        try
        {
            return Session.QueryOver<T>().Where(expression).Take(1).SingleOrDefaultAsync(cancellationToken);
        }
        catch (Exception)
        {
            return null;
        }
    }

    public Task<T> GetSingleAsync(Expression<Func<T, bool>> expression, CancellationToken cancellationToken = default)
    {
        try
        {
            return Session.QueryOver<T>().Where(expression).Take(1).SingleOrDefaultAsync(cancellationToken);
        }
        catch (Exception)
        {
            return null;
        }
    }

    public Task<IList<T>> FindAsync(Expression<Func<T, bool>> expression, CancellationToken cancellationToken = default)
    {
        return Session.QueryOver<T>().Where(expression).ListAsync(cancellationToken);
    }

    public Task<IList<T>> GetAllAsync(CancellationToken cancellationToken = default) =>
        Session.QueryOver<T>().ListAsync(cancellationToken);

    public Task<IList<T>> GetAllOrderByAsync(Expression<Func<T, object>> expression, bool ascending,
        CancellationToken cancellationToken = default)
    {
        return ascending
            ? Session.QueryOver<T>().OrderBy(expression).Asc.ListAsync(cancellationToken)
            : Session.QueryOver<T>().OrderBy(expression).Desc.ListAsync(cancellationToken);
    }


    public async Task<T> UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        await Session.UpdateAsync(entity, cancellationToken);
        return entity;
    }

    public async Task<T> SaveOrUpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        await Session.SaveOrUpdateAsync(entity, cancellationToken);
        return entity;
    }

    public async Task<bool> DeleteAsync(T entity, CancellationToken cancellationToken = default)
    {
        await Session.DeleteAsync(entity, cancellationToken);
        return true;
    }

    public async Task<bool> DeleteByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        // if (await ContainsIdAsync(id, cancellationToken) == false)
        // {
        //     throw new NotFoundException();
        // }
        await Session.DeleteAsync(await LoadByIdAsync(id, cancellationToken), cancellationToken);
        return true;
    }

    public async Task<bool> ContainsIdAsync(long id, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = await GetByIdAsync(id, cancellationToken);
            return entity != null;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> ContainsAsync(Expression<Func<T, bool>> expression,
        CancellationToken cancellationToken = default)
    {
        return await CountAsync(expression, cancellationToken) > 0;
    }

    public Task<int> CountAsync(Expression<Func<T, bool>> expression, CancellationToken cancellationToken = default)
    {
        return Session.QueryOver<T>().Where(expression).RowCountAsync(cancellationToken);
    }
}