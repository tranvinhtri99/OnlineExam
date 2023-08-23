using System.Diagnostics;
using AutoMapper;
using OnlineExam.Common.Enums;
using OnlineExam.React.UnitOfWork;
using OnlineExam.Models.Domain;
using OnlineExam.Models.Requests.ExamRequest;
using OnlineExam.Models.Requests.QuestionRequest;
using OnlineExam.Models.Responses.QuestionResponses;
using OnlineExam.Responsitories;
using NHibernate;

namespace OnlineExam.Services;

public class QuestionService
{
    private readonly QuestionRepository _repository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWorkProvider _unitOfWorkProvider;

    public QuestionService(QuestionRepository repository, IMapper mapper, IUnitOfWorkProvider unitOfWorkProvider)
    {
        _repository = repository;
        _mapper = mapper;
        _unitOfWorkProvider = unitOfWorkProvider;
    }

    public async Task<IList<QuestionDto>> GetAllAsync(string? searchContentQuestion, CancellationToken cancellationToken = default)
    {
        var questions = await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
        {
            var questions = await _repository.GetAllQuestionAsync(searchContentQuestion, cancellationToken);
            foreach (var question in questions)
            {
                await NHibernateUtil.InitializeAsync(question.Answers, cancellationToken);
            }

            // Task.WaitAll(questions.Select(x =>
            //     NHibernateUtil.InitializeAsync(x.Answers, cancellationToken)).ToArray());

            return questions;
        });
        
        return _mapper.Map<IList<Question>, IList<QuestionDto>>(questions);
    }

    public async Task<QuestionDto> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return _mapper.Map<QuestionDto>(
            await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
            {
                var question = await _repository.GetQuestionByIdAsync(id, cancellationToken);
                // if (question.Type == TypeQuestion.Quiz)
                // {
                //     await NHibernateUtil.InitializeAsync(question.Answers, cancellationToken);
                // }
                return question;
            }));
    }

    public async Task<IList<LevelQuestion>> GetLevelQuestionAsync(long id, CancellationToken cancellationToken = default)
    {
        var levelQuestions = await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () => await _repository.GetLevelQuestionAsync(id, cancellationToken));

        return _mapper.Map<IList<LevelQuestion>>(levelQuestions);
    }

    public async Task<QuestionDto> CreateQuestionAsync(CreateQuestionDto questionDto, CancellationToken cancellationToken = default)
    {
        questionDto.ValidateAnswer();
        return _mapper.Map<QuestionDto>(await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
            await _repository.AddAsync(_mapper.Map<Question>(questionDto), cancellationToken)));
    }

    public async Task<QuestionDto> UpdateQuestionAsync(UpdateQuestionDto questionDto, CancellationToken cancellationToken = default)
    {
        questionDto.ValidateAnswer();
        
        using (var uow = _unitOfWorkProvider.Provide())
        {
            var entity = await _repository.GetAndCheckVersionAsync(questionDto, cancellationToken);
            entity = _mapper.Map(questionDto, entity);
            entity.Subject = await _repository.GetByIdAsync<Subject>(questionDto.SubjectId);
            for (var i = 0; i < entity.Answers.Count; i++)
            {
                var answer = entity.Answers[i];
                if (questionDto.Answers.Count > i)
                {
                    answer = _mapper.Map(questionDto.Answers[i], answer);
                }
                else
                {
                    entity.Answers.Remove(answer);
                    // answer.Question = null;
                    // await _repository.DeleteAnswerAsync(answer, cancellationToken);
                }

                // await _repository.SaveOrUpdateAnswerAsync(answer, cancellationToken);
            }

            for (var i = entity.Answers.Count; i < questionDto.Answers.Count; i++)
            {
                var answer = _mapper.Map<AnswerQuestion>(questionDto.Answers[i]);
                entity.AddAnswer(answer);
            }

            await _repository.SaveOrUpdateAsync(entity, cancellationToken);
            uow.Complete();
            entity.RowVersion++;
            return _mapper.Map<QuestionDto>(entity);
        }
    }

    public Task<bool> DeleteQuestionAsync(long id, CancellationToken cancellationToken = default)
    {
        return _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
            await _repository.DeleteByIdAsync(id, cancellationToken));
    }
}