using AutoMapper;
using OnlineExam.Common.Encrypts;
using OnlineExam.Models.Domain;
using OnlineExam.Models.DTOs;
using OnlineExam.Models.Requests.AccountRequest;
using OnlineExam.React.UnitOfWork;
using OnlineExam.Responsitories;

namespace OnlineExam.Services;

public class AccountService
{
    private readonly AccountRepository _repository;
    private readonly ClassroomRepository _repositoryClassroom;
    private readonly IMapper _mapper;
    private readonly IUnitOfWorkProvider _unitOfWorkProvider;

    public AccountService(AccountRepository repository, IMapper mapper, ClassroomRepository repositoryClassroom, IUnitOfWorkProvider unitOfWorkProvider)
    {
        _repository = repository;
        _mapper = mapper;
        _repositoryClassroom = repositoryClassroom;
        _unitOfWorkProvider = unitOfWorkProvider;
    }

    public async Task<IList<AccountDto>> GetAllAccountAsync(CancellationToken cancellationToken = default)
    {
        await using (var uow = _unitOfWorkProvider.Provide())
        {
            var accounts = await _repository.GetAllAsync(cancellationToken);

            foreach (var account in accounts)
            {
                if (account is Student student)
                {

                    await uow.InitializeProxyAsync(student.Classroom, cancellationToken);
                }
            }

            var result = _mapper.Map<IList<AccountDto>>(accounts);

            return result;
        }
    } 

    public async Task<StudentDto> CreateStudentAsync(CreateStudentDto studentDto, CancellationToken cancellationToken = default)
    {
        return _mapper.Map<StudentDto>(await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
        {
            var student = _mapper.Map<Student>(studentDto);
            // student.Classroom = await _repositoryClassroom.LoadByIdAsync(studentDto.ClassroomId, cancellationToken);

            return await _repository.AddAsync(student, cancellationToken);
        }));
    }
    
    public async Task<LecturerDto> CreateLecturerAsync(CreateLecturerDto lecturerDto, CancellationToken cancellationToken = default)
    {
        return _mapper.Map<LecturerDto>(await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
            await _repository.AddAsync(_mapper.Map<Lecturer>(lecturerDto), cancellationToken)));
    }

    public async Task<string> ResetPasswordAsync(long id, CancellationToken cancellationToken = default)
    {
        var password = "Aa12345@";
        await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
            await _repository.SetPasswordAsync(id, password.ToSha256(), cancellationToken));
        return password;
    }

    public async Task<string> UpdatePasswordAsync(long id, string pass, CancellationToken cancellationToken = default)
    {
        var password = pass;
        await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
            await _repository.SetPasswordAsync(id, password.ToSha256(), cancellationToken));
        return password;
    }

    public Task<bool> DeleteAccountAsync(long id, CancellationToken cancellationToken = default)
    {
        return _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
            await _repository.DeleteByIdAsync(id, cancellationToken));
    }
    
    public async Task<StudentDto> UpdateStudentAsync(UpdateStudentDto studentDto, CancellationToken cancellationToken = default)
    {
        using var uow = _unitOfWorkProvider.Provide();
        var entity = (Student) await _repository.GetAndCheckVersionAsync(studentDto, cancellationToken);
        entity.Username = studentDto.Username;
        entity.Name = studentDto.Name;
        entity.Classroom = await _repositoryClassroom.LoadByIdAsync(studentDto.ClassroomId, cancellationToken);
            
        await _repository.UpdateAsync(entity, cancellationToken);
        uow.Complete();
        entity.RowVersion++;
        return _mapper.Map<StudentDto>(entity);
    }
    
    public async Task<LecturerDto> UpdateLecturerAsync(UpdateLecturerDto lecturerDto, CancellationToken cancellationToken = default)
    {
        using (var uow = _unitOfWorkProvider.Provide())
        {
            var entity = await _repository.GetAndCheckVersionAsync(lecturerDto, cancellationToken);
            entity.Username = lecturerDto.Username;
            entity.Name = lecturerDto.Name;
            await _repository.UpdateAsync(entity, cancellationToken);
            uow.Complete();
            entity.RowVersion++;
            return _mapper.Map<LecturerDto>(entity);
        }
    }
    
}