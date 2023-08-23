using AutoMapper;
using OnlineExam.Common.Domain;
using OnlineExam.Common.Encrypts;
using OnlineExam.Common.Resources;
using OnlineExam.Common.Tokens;
using OnlineExam.React.UnitOfWork;
using OnlineExam.Models.Domain;
using OnlineExam.Models.DTOs;
using OnlineExam.Models.Exceptions;
using OnlineExam.Models.Requests.AuthenticationRequests;
using OnlineExam.Models.Responses.AuthenticationResponses;
using OnlineExam.Responsitories;
using NHibernate;

namespace OnlineExam.Services;

public class AuthenticationService
{
    private readonly AccountRepository _repository;
    private readonly JwtManagement _jwt;
    private readonly IMapper _mapper;
    private readonly IUnitOfWorkProvider _unitOfWorkProvider;

    public AuthenticationService(AccountRepository repository, JwtManagement jwt, IMapper mapper, IUnitOfWorkProvider unitOfWorkProvider)
    {
        _repository = repository;
        _jwt = jwt;
        _mapper = mapper;
        _unitOfWorkProvider = unitOfWorkProvider;
    }

    public async Task<LoginReplyDto> GetTokenAsync(LoginDto loginDto, CancellationToken cancellationToken = default)
    {
        var account = await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () => 
            await _repository.GetAccountAsync(loginDto.Username, loginDto.Password.ToSha256(), cancellationToken));
        if (account is null)
        {
            throw new NotFoundException(ErrorMessage.MessageLoginFail);
        }

        var token = _jwt.CreateToken(account);

        return new LoginReplyDto()
        {
            Token = token,
            Account = _mapper.Map<AccountDto>(account)
        };
    }

    public async Task<LoginReplyDto> GetLoginReply(long accountId, string token, CancellationToken cancellationToken = default)
    {
        var account = await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
        {
            var account = await _repository.GetByIdAsync(accountId, cancellationToken);
            if (account is Student student)
            {
                await NHibernateUtil.InitializeAsync(student.Classroom, cancellationToken);
            }
            return account;
        });
        
        return new LoginReplyDto
        {
            Token = token,
            Account = _mapper.Map<AccountDto>(account)
        };
    }
}