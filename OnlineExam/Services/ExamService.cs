using System.Linq.Expressions;
using AutoMapper;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using OnlineExam.Common.Domain;
using OnlineExam.Common.Exceptions;
using OnlineExam.React.UnitOfWork;
using OnlineExam.Models.AnswerTestModel;
using OnlineExam.Models.Domain;
using OnlineExam.Models.DTOs;
using OnlineExam.Models.Exceptions;
using OnlineExam.Models.Requests.ExamRequest;
using OnlineExam.Models.Requests.QuestionRequest;
using OnlineExam.Models.Requests.ScoreRequests;
using OnlineExam.Models.Responses.QuestionResponses;
using OnlineExam.Responsitories;
using Wkhtmltopdf.NetCore;
using NHibernate;

namespace OnlineExam.Services;

public class ExamService
{
    private readonly ExamRepository _repository;
    private readonly QuestionRepository _questionRepository;
    private readonly ClassroomRepository _classroomRepository;
    private readonly AccountRepository _accountRepository;
    private readonly IMapper _mapper;
    private readonly IGeneratePdf _generatePdf;
    private readonly ScoreRepository _scoreRepository;
    private readonly AnswerRepository _answerRepository;
    private readonly IUnitOfWorkProvider _unitOfWorkProvider;

    public ExamService(ExamRepository repository, IMapper mapper, QuestionRepository questionRepository,
        ClassroomRepository classroomRepository, AccountRepository accountRepository, IGeneratePdf generatePdf,
        ScoreRepository scoreRepository, AnswerRepository answerRepository, IUnitOfWorkProvider unitOfWorkProvider)
    {
        _repository = repository;
        _mapper = mapper;
        _questionRepository = questionRepository;
        _classroomRepository = classroomRepository;
        _accountRepository = accountRepository;
        _generatePdf = generatePdf;
        _scoreRepository = scoreRepository;
        _answerRepository = answerRepository;
        _unitOfWorkProvider = unitOfWorkProvider;
    }

    public async Task<IList<ExamListDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var exams = await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
        {
            var exams = await _repository.GetAllOrderByAsync(x => x.Start, false, cancellationToken);
            foreach (var exam in exams)
            {
                await NHibernateUtil.InitializeAsync(exam.Subject, cancellationToken);
                await NHibernateUtil.InitializeAsync(exam.Questions, cancellationToken);
                await NHibernateUtil.InitializeAsync(exam.Students, cancellationToken);
                await NHibernateUtil.InitializeAsync(exam.Scores, cancellationToken);
            }

            return exams;
        });

        return _mapper.Map<IList<ExamListDto>>(exams);
    }

    public async Task<ExamScoreDto> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        using var uow = _unitOfWorkProvider.Provide();

        var exam = await _repository.GetExamByIdAsync(id, cancellationToken);
        foreach (var score in exam.Scores)
        {
            await uow.InitializeProxyAsync(score.Student.Classroom, cancellationToken);
        }
        await uow.InitializeProxyAsync(exam.Subject, cancellationToken);
        await uow.InitializeProxyAsync(exam.Students, cancellationToken);
        await uow.InitializeProxyAsync(exam.Scores, cancellationToken);
        await uow.InitializeProxyAsync(exam.Questions, cancellationToken);

        uow.Complete();

        var examScore = _mapper.Map<ExamScoreDto>(exam);

        return examScore;
    }

    public async Task<ExamListDto> CreateExamAsync(CreateExamDto examDto, CancellationToken cancellationToken = default)
    {
        var exam = _mapper.Map<Exam>(examDto);

        using (var uow = _unitOfWorkProvider.Provide())
        {
            var allQuestions = new List<Question>();

            foreach (var levelQuestion in examDto.LevelQuestions)
            {
                var questions =
                    await _questionRepository.GetQuestionsByLevelAsync(examDto.SubjectId, levelQuestion.Key,
                        cancellationToken);
                if (questions.Count < levelQuestion.Value)
                {
                    throw new ExamException("question need lager question in database");
                }

                var questionsFilter = questions.OrderBy(x => Guid.NewGuid()).Take(levelQuestion.Value);
                allQuestions.AddRange(questionsFilter);
            }

            exam.Questions = allQuestions;
            exam.Subject = await _repository.GetByIdAsync<Subject>(examDto.SubjectId, cancellationToken);

            exam.Students =
                await _classroomRepository.GetStudentByClassroomIdAsync(examDto.ClassroomsId.ToArray(),
                    cancellationToken);
            await _repository.AddAsync(exam, cancellationToken);

            uow.Complete();
        }

        return _mapper.Map<ExamListDto>(exam);
    }

    public Task<StudentDto> AddStudentAsync(long examId, string userOrId, CancellationToken cancellationToken = default)
    {
        Expression<Func<Account, bool>> expression = x => x.Username == userOrId;
        return _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
        {
            var exam = await _repository.GetByIdAsync(examId, cancellationToken);
            if (exam.Start.AddMinutes(exam.Time) <= DateTime.Now)
            {
                throw new ExamException("exam is closed");
            }
            var student = await GetStudentAsync(userOrId);

            if (exam.Students.Contains(student))
            {
                throw new DuplicateException("Student already exists in the exam list");
            }

            exam.Students.Add(student);
            await _repository.UpdateAsync(exam, cancellationToken);
            return _mapper.Map<StudentDto>(student);
        });
    }

    private async Task<Student> GetStudentAsync(string userOrId, CancellationToken cancellationToken = default)
    {
        return await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
        {
            var account = await _accountRepository.GetSingleAsync(x => x.Username == userOrId || x.Name == userOrId, cancellationToken);
            {
                if (account is Student student)
                {
                    return student;
                }
            }

            if (long.TryParse(userOrId, out var studentId))
            {
                account = await _accountRepository.GetByIdAsync(studentId, cancellationToken);
                if (account is Student student)
                {
                    return student;
                }
            }

            throw new NotFoundException("Student not found");
        });
    }

    public Task<bool> RemoveStudentAsync(long examId, string userOrId, CancellationToken cancellationToken = default)
    {
        Expression<Func<Account, bool>> expression = x => x.Username == userOrId;

        return _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
        {
            if (await _accountRepository.GetSingleAsync(expression, cancellationToken) is not Student student)
            {
                throw new NotFoundException("Student not found");
            }

            if (await _scoreRepository.ContainsScoreAsync(score => score.Student == student && score.Exam.Id == examId,
                    cancellationToken))
            {
                throw new ExamException("Students who have already taken the exam cannot be deleted");
            }

            var exam = await _repository.GetByIdAsync(examId, cancellationToken);

            if (long.TryParse(userOrId, out var studentId))
            {
                expression = x => x.Username == userOrId || x.Id == studentId;
            }

            if (!exam.Students.Contains(student))
            {
                throw new NotFoundException("students not on the list of exam questions");
            }

            exam.Students.Remove(student);

            await _repository.UpdateAsync(exam, cancellationToken);
            return true;
        });
    }

    public Task<bool> DeleteExamAsync(long examId, CancellationToken cancellationToken = default)
    {
        return _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(() => _repository.DeleteByIdAsync(examId, cancellationToken));
    }

    public async Task<IActionResult> CreatePdfPrintListAsync(long examId, long classroomId,
        CancellationToken cancellationToken = default)
    {
        var examScore = await GetByIdAsync(examId, cancellationToken);

        if (classroomId != 0)
        {
            examScore.StudentWithScores =
                examScore.StudentWithScores.Where(x => x.Classroom?.Id == classroomId).ToList();
        }

        return await _generatePdf.GetPdf("Views/TemplatePrintList.cshtml", examScore);
    }

    public async Task<IActionResult> CreatePdfExamTestAsync(long examId, long classroomId,
        CancellationToken cancellationToken = default)
    {
        using (_unitOfWorkProvider.Provide())
        {
            var exam = await _repository.GetExamByIdAsync(examId, cancellationToken);

            if (classroomId != 0)
            {
                exam.Students = exam.Students.Where(x => x.Classroom?.Id == classroomId).ToList();
            }

            var answers = await _answerRepository.GetAnswerTestAsync(examId, exam.Students, cancellationToken);

            var examStudentAnswer = _mapper.Map<ExamStudentAnswer>(exam);
            foreach (var student in examStudentAnswer.StudentAnswers)
            {
                var answersStudent = answers.Where(x => x.Student.Id == student.Id).Select(x => x.AnswerQuestion.Id)
                    .ToList();
                student.Questions = _mapper.Map<IList<QuestionAnswer>>(exam.Questions);

                foreach (var question in student.Questions)
                {
                    foreach (var answer in question.Answers)
                    {
                        if (answersStudent.Contains(answer.Id))
                        {
                            answer.Selected = true;
                        }

                        if ((answersStudent.Contains(answer.Id) && answer.Correct == false) ||
                            (!answersStudent.Contains(answer.Id)) && answer.Correct)
                        {
                            question.Correct = false;
                        }
                    }
                }
            }

            return await _generatePdf.GetPdf("Views/TemplatePrintAnswer.cshtml", examStudentAnswer);
        }
    }

    public async Task<IList<ExamJoinTestDto>> GetExamJoinAsync(long studentId,
        CancellationToken cancellationToken = default)
    {
        var exams = await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
        {
            var exams = await _repository.GetListExamJoinAsync(studentId, cancellationToken);

            foreach (var exam in exams)
            {
                await NHibernateUtil.InitializeAsync(exam.Subject, cancellationToken);
                await NHibernateUtil.InitializeAsync(exam.Questions, cancellationToken);
            }

            return exams;
        });

        return _mapper.Map<IList<ExamJoinTestDto>>(exams);
    }

    public async Task<ExamTestDto> GetExamTestAsync(long examId, long studentId,
        CancellationToken cancellationToken = default)
    {
        var exam = await _unitOfWorkProvider.PerformActionInUnitOfWorkAsync(async () =>
        {
            var exam = await _repository.GetByIdAsync(examId, cancellationToken);

            if (exam.Start.AddMinutes(exam.Time) <= DateTime.Now)
            {
                throw new ExamException("the exam is closed");
            }

            if (exam.Start >= DateTime.Now)
            {
                throw new ExamException("the exam is not open yet");
            }

            var studentSubmittedExam = exam.Scores.Select(x => x.Student.Id).ToList();
            if (studentSubmittedExam.Contains(studentId))
            {
                throw new ExamException("you have submitted the test. Please return to the homepage to see the score");
            }

            await NHibernateUtil.InitializeAsync(exam.Subject, cancellationToken);
            await NHibernateUtil.InitializeAsync(exam.Questions, cancellationToken);
            foreach (var question in exam.Questions)
            {
                await NHibernateUtil.InitializeAsync(question.Answers, cancellationToken);
            }


            return exam;
        });

        return _mapper.Map<ExamTestDto>(exam);
    }

    public async Task<ScoreDto> SubmitExamAsync(long examId, long studentId, IList<QuestionTestDto> questionTests,
        CancellationToken cancellationToken = default)
    {
        using (var uow = _unitOfWorkProvider.Provide())
        {
            var exam = await _repository.GetByIdAsync(examId, cancellationToken);
            if (exam.Start.AddMinutes(exam.Time + 1) <= DateTime.Now)
            {
                throw new ExamException("Exam submission time has expired. Your test will not be scored");
            }

            await NHibernateUtil.InitializeAsync(exam.Questions, cancellationToken);

            var correctQuestion = 0;

            foreach (var question in exam.Questions)
            {
                await NHibernateUtil.InitializeAsync(question.Answers, cancellationToken);

                var questionTest = questionTests.SingleOrDefault(x => x.Id == question.Id);
                if (questionTest != null && question.IsAnswerQuestionCorrect(questionTest))
                {
                    correctQuestion++;
                }
            }

            if (await _accountRepository.GetByIdAsync(studentId, cancellationToken) is not Student student)
            {
                throw new NotFoundException("Not found account");
            }

            await SaveAnswerTestAsync(exam, student, questionTests, cancellationToken);

            var point = (float) correctQuestion / exam.Questions.Count * 10;
            var score = new Score()
            {
                Exam = exam,
                Student = student,
                Point = point
            };

            await _scoreRepository.AddAsync(score, cancellationToken);
            uow.Complete();
            return _mapper.Map<ScoreDto>(score);
        }
    }

    private async Task SaveAnswerTestAsync(Exam exam, Student student, IEnumerable<QuestionTestDto> questionTests,
        CancellationToken cancellationToken = default)
    {
        using (var uow = _unitOfWorkProvider.Provide())
        {
            foreach (var question in questionTests)
            {
                foreach (var answer in question.Answers)
                {
                    if (answer.Selected == false) continue;

                    var answerQuestion =
                        await _answerRepository.LoadByIdAsync<AnswerQuestion>(answer.Id, cancellationToken);

                    var answerTest = new AnswerTest()
                    {
                        Exam = exam,
                        Student = student,
                        AnswerQuestion = answerQuestion
                    };

                    await _answerRepository.AddAsync(answerTest, cancellationToken);
                }
            }

            uow.Complete();
        }
    }

    public async Task<FileContentResult> CreateExcelListAsync(long examId, long classroomId,
        CancellationToken cancellationToken = default)
    {
        var examScore = await GetByIdAsync(examId, cancellationToken);

        if (classroomId != 0)
        {
            examScore.StudentWithScores =
                examScore.StudentWithScores.Where(x => x.Classroom?.Id == classroomId).ToList();
        }

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("List Students");

        var currentRow = 1;

        worksheet.Cell(currentRow, 1).Value = "STT";
        worksheet.Cell(currentRow, 2).Value = "Id";
        worksheet.Cell(currentRow, 3).Value = "Username";
        worksheet.Cell(currentRow, 4).Value = "Name";
        worksheet.Cell(currentRow, 5).Value = "Classroom";
        worksheet.Cell(currentRow, 6).Value = "Score";


        foreach (var student in examScore.StudentWithScores)
        {
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = currentRow;
            worksheet.Cell(currentRow, 2).Value = student.Id;
            worksheet.Cell(currentRow, 3).Value = student.Username;
            worksheet.Cell(currentRow, 4).Value = student.Name;
            worksheet.Cell(currentRow, 5).Value = student.Classroom?.Name;
            worksheet.Cell(currentRow, 6).Value = student.Score;
        }

        using (var stream = new MemoryStream())
        {
            workbook.SaveAs(stream);
            var content = stream.ToArray();

            return new FileContentResult(
                content,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            {
                FileDownloadName = $"Score {examScore.Name} ({examScore.Subject.Name}).xlsx"
            };
        }
    }
}