using AutoMapper;
using OnlineExam.React.UnitOfWork;
using OnlineExam.Models.Requests.ScoreRequests;
using OnlineExam.Responsitories;

namespace OnlineExam.Services;

public class ScoreService
{
    private readonly ScoreRepository _repository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWorkProvider _unitOfWorkProvider;

    public ScoreService(ScoreRepository repository, IMapper mapper, IUnitOfWorkProvider unitOfWorkProvider)
    {
        _repository = repository;
        _mapper = mapper;
        _unitOfWorkProvider = unitOfWorkProvider;
    }

    public async Task<IList<ScoreViewDto>> GetAllScoreStudentAsync(long studentId, CancellationToken cancellationToken = default)
    {
        var scores = await 
            _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(() => _repository.GetAllScoreStudentAsync(studentId, cancellationToken));

        return _mapper.Map<IList<ScoreViewDto>>(scores);

    }
}