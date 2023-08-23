using AutoMapper;
using OnlineExam.React.UnitOfWork;
using OnlineExam.Models.Domain;
using OnlineExam.Models.DTOs;
using OnlineExam.Models.Requests.ClassroomRequest;
using OnlineExam.Responsitories;
using NHibernate;

namespace OnlineExam.Services;

public class ClassroomService
{
    private readonly ClassroomRepository _repository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWorkProvider _unitOfWorkProvider;

    public ClassroomService(ClassroomRepository repository, IMapper mapper, IUnitOfWorkProvider unitOfWorkProvider)
    {
        _repository = repository;
        _mapper = mapper;
        _unitOfWorkProvider = unitOfWorkProvider;
    }

    public async Task<IList<ClassroomDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return _mapper.Map<IList<ClassroomDto>>(
            await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(() => _repository.GetAllAsync(cancellationToken)));
    }

    public async Task<ClassroomWithStudentDto> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return _mapper.Map<ClassroomWithStudentDto>(
            await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
            {
                var classroom = await _repository.GetByIdAsync(id, cancellationToken);
                await NHibernateUtil.InitializeAsync(classroom.Students, cancellationToken);

                return classroom;
            }));
    }
    
    public async Task<ClassroomDto> CreateClassroomAsync(CreateClassroomDto classroomDto, CancellationToken cancellationToken = default)
    {
        return _mapper.Map<ClassroomDto>(await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
            await _repository.AddAsync(_mapper.Map<Classroom>(classroomDto), cancellationToken)));
    }

    public async Task<ClassroomDto> UpdateClassroomAsync(UpdateClassroomDto classroomDto, CancellationToken cancellationToken = default)
    {
        using (var uow = _unitOfWorkProvider.Provide())
        {
            var entity = await _repository.GetAndCheckVersionAsync(classroomDto, cancellationToken);
            entity = _mapper.Map(classroomDto, entity);
            await _repository.UpdateAsync(entity, cancellationToken);
            uow.Complete();
            entity.RowVersion++;
            return _mapper.Map<ClassroomDto>(entity);
        }
    }

    public Task<bool> DeleteClassroomAsync(long id, CancellationToken cancellationToken = default)
    {
        return _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
            await _repository.DeleteByIdAsync(id, cancellationToken));
    }
}