using AutoMapper;
using OnlineExam.Common.Resources;
using OnlineExam.React.UnitOfWork;
using OnlineExam.Models.Domain;
using OnlineExam.Models.DTOs;
using OnlineExam.Models.Exceptions;
using OnlineExam.Models.Requests.SubjectRequest;
using OnlineExam.Responsitories;

namespace OnlineExam.Services;

public class SubjectService
{
    private readonly SubjectRepository _repository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWorkProvider _unitOfWorkProvider;

    public SubjectService(SubjectRepository repository, IMapper mapper, IUnitOfWorkProvider unitOfWorkProvider)
    {
        _repository = repository;
        _mapper = mapper;
        _unitOfWorkProvider = unitOfWorkProvider;
    }

    public async Task<IList<SubjectDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return _mapper.Map<IList<SubjectDto>>(
            await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(() => _repository.GetAllAsync(cancellationToken)));
    }

    public async Task<SubjectDto> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return _mapper.Map<SubjectDto>(
            await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
            {
                var subject = await _repository.GetByIdAsync(id, cancellationToken);
                return subject;
            }));
    }
    
    public async Task<SubjectDto> CreateSubjectAsync(CreateSubjectDto studentDto, CancellationToken cancellationToken = default)
    {
        return _mapper.Map<SubjectDto>(await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
            await _repository.AddAsync(_mapper.Map<Subject>(studentDto), cancellationToken)));
    }

    public async Task<SubjectDto> UpdateSubjectAsync(UpdateSubjectDto subjectDto, CancellationToken cancellationToken = default)
    {
        using var uow = _unitOfWorkProvider.Provide();
        
        var entity = await _repository.GetAndCheckVersionAsync(subjectDto, cancellationToken);
        entity = _mapper.Map(subjectDto, entity);
        await _repository.UpdateAsync(entity, cancellationToken);
        uow.Complete();
        entity.RowVersion++;
        return _mapper.Map<SubjectDto>(entity);
    }

    public Task<bool> DeleteSubjectAsync(long id, CancellationToken cancellationToken = default)
    {
        return _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async() =>
            await _repository.DeleteByIdAsync(id, cancellationToken));
    }
}