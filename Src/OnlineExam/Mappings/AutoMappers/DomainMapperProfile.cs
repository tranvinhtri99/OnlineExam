using AutoMapper;
using OnlineExam.Common.Domain;
using OnlineExam.Common.Encrypts;
using OnlineExam.Common.Enums;
using OnlineExam.Common.Utils;
using OnlineExam.Models.AnswerTestModel;
using OnlineExam.Models.Domain;
using OnlineExam.Models.DTOs;
using OnlineExam.Models.Requests.AccountRequest;
using OnlineExam.Models.Requests.ClassroomRequest;
using OnlineExam.Models.Requests.ExamRequest;
using OnlineExam.Models.Requests.QuestionRequest;
using OnlineExam.Models.Requests.ScoreRequests;
using OnlineExam.Models.Requests.SubjectRequest;
using OnlineExam.Models.Responses.QuestionResponses;

namespace OnlineExam.Mappings.AutoMappers;

public class DomainMapperProfile : Profile
{
    public DomainMapperProfile()
    {
        // client send DTO và nhận DTO.
        // từ service luôn luôn là domain.

        CreateMap<BaseDomain, BaseDomainDto>().ReverseMap();
        CreateMapEntity<Account, AccountDto>()
            .ForMember(dest => dest.Type, x => x.MapFrom(src => src.GetType().Name))
            .MaxDepth(2);
        CreateMapAccount<Lecturer, LecturerDto>();
        CreateMapAccount<Student, StudentDto>();
        CreateMapAccount<Admin, AdminDto>();
        
        CreateMapEntity<Subject, SubjectDto>();
        CreateMapEntity<Classroom, ClassroomDto>();

        CreateMap<CreateLecturerDto, Lecturer>()
            .ForMember(dest => dest.Password, mem => mem.MapFrom(src => src.Password.ToSha256()))
            .Ignore(x => x.Id, x => x.RowVersion);
        CreateMap<CreateStudentDto, Student>()
            .ForMember(dest => dest.Password, mem => mem.MapFrom(src => src.Password.ToSha256()))
            .ForMember(dest => dest.Classroom, mem => mem.MapFrom(src => new Classroom(){Id = src.ClassroomId}))
            .Ignore(x => x.Id, x => x.RowVersion, x => x.Exams, x => x.Scores);

        CreateMap<UpdateStudentDto, Student>()
            .ForMember(dest => dest.Classroom, mem => mem.MapFrom(src => new Classroom(){Id = src.ClassroomId}))
            .Ignore(x => x.Scores, x => x.Exams, x => x.Password);
        // CreateMap<Update, Student>();

        CreateMap<CreateSubjectDto, Subject>()
            .Ignore(x => x.Id, x => x.RowVersion, x => x.Questions, x => x.Exams);
        CreateMap<UpdateSubjectDto, Subject>()
            .Ignore(x => x.Exams, x => x.Questions);
        
        CreateMap<CreateClassroomDto, Classroom>().Ignore(x => x.Id, x => x.RowVersion, x => x.Students);
        CreateMap<UpdateClassroomDto, Classroom>().Ignore(x => x.Students);

        CreateMap<AnswerQuestion, AnswerQuestionDto>();

        CreateMap<CreateAnswerQuestionDto, AnswerQuestion>().Ignore(x => x.Id, x => x.Question);
        CreateMap<UpdateAnswerQuestionDto, AnswerQuestion>().Ignore(x => x.Question, x => x.Id);
        CreateMap<CreateQuestionDto, Question>()
            .ForMember(dest => dest.Type, x => x.MapFrom(src => TypeQuestion.Quiz))
            .ForMember(dest => dest.Subject, x => x.MapFrom(src => new Subject(){Id = src.SubjectId}))
            .Ignore(x => x.Id, x => x.RowVersion)
            .AfterMap((createDto, question) =>
            {
                foreach (var answer in question.Answers)
                {
                    answer.Question = question;
                }
            });
        CreateMap<UpdateQuestionDto, Question>(MemberList.None)
            .ForMember(dest => dest.Type, x => x.MapFrom(src => TypeQuestion.Quiz))
            .ForMember(dest => dest.Subject, x => x.MapFrom(src => new Subject{Id = src.SubjectId}))
            .Ignore(x => x.Answers);
        CreateMapEntity<Question, QuestionDto>(MemberList.None);
        CreateMap<Question, QuestionExamDto>();
        CreateMap<Question, QuestionTestDto>();
        CreateMap<AnswerQuestion, AnswerQuestionTest>()
            .ForMember(dest => dest.Selected, x => x.MapFrom(src => false));

        CreateMap<Score, ScoreExamDto>();

        CreateMapEntity<Exam, ExamDto>();
        CreateMapEntity<Exam, ExamListDto>()
            .ForMember(dest => dest.CountQuestion, x => x.MapFrom(src => src.Questions.Count))
            .ForMember(dest => dest.CountStudents, x => x.MapFrom(src => src.Students.Count))
            .ForMember(dest => dest.CountScores, x => x.MapFrom(src => src.Scores.Count));
        CreateMapEntity<Exam, ExamJoinTestDto>()
            .ForMember(dest => dest.CountQuestion, x => x.MapFrom(src => src.Questions.Count));
        CreateMap<CreateExamDto, Exam>()
            .ForMember(dest => dest.Subject, x => x.MapFrom(src => new Subject{Id = src.SubjectId}))
            .Ignore(x => x.Id, x => x.RowVersion, x => x.Students, x => x.Scores, x => x.Questions);
        CreateMap<Exam, ExamTestDto>()
            .ForMember(dest => dest.TimeCountDown,
                x => x.MapFrom(src => (long) (src.Start.AddMinutes(src.Time) - DateTime.Now).TotalSeconds))
            .AfterMap((exam, examTest) =>
            {
                examTest.Questions = examTest.Questions.OrderBy(_ => Guid.NewGuid()).ToList();
                foreach (var question in examTest.Questions)
                {
                    question.Answers = question.Answers.OrderBy(_ => Guid.NewGuid()).ToList();
                }
            });

        CreateMap<object[], LevelQuestion>()
            .ForMember(dest => dest.Key, x => x.MapFrom(src => src[0]))
            .ForMember(dest => dest.Value, x => x.MapFrom(src => src[1]));
        
        CreateMap<Score, ScoreDto>();
        CreateMap<Exam, ExamScoreDto>()
            .ForMember(dest => dest.CountQuestion, x => x.MapFrom(src => src.Questions.Count))
            .ForMember(dest => dest.CountScore, x => x.MapFrom(src => src.Scores.Count))
            .Ignore(x => x.StudentWithScores)
            .AfterMap((exam, examScore, context) =>
            {
                examScore.StudentWithScores = exam.Students.LeftOuterJoin(exam.Scores, student => student.Id, score => score.Student.Id,
                    (student, scoreExam) =>
                    {
                        var studentWithScore = context.Mapper.Map<StudentWithScoreDto>(student);

                        if (scoreExam is not null)
                        {
                            studentWithScore.Score = scoreExam.Point;
                        }
                        
                        return studentWithScore;
                    }
                ).ToList();
            });
        CreateMapAccount<Student, StudentWithScoreDto>().Ignore(x => x.Score);

        CreateMap<Score, ScoreViewDto>()
            .ForMember(dest => dest.Score, x => x.MapFrom(src => src.Point))
            .ForMember(dest => dest.ExamName, x => x.MapFrom(src => src.Exam.Name))
            .ForMember(dest => dest.SubjectName, x => x.MapFrom(src => src.Exam.Subject.Name));


        CreateMap<Student, StudentAnswer>()
            .IncludeBase<Student, StudentWithScoreDto>()
            .Ignore(x => x.Questions);
        CreateMap<Exam, ExamStudentAnswer>()
            .ForMember(dest => dest.StudentAnswers, x => x.MapFrom(src => src.Students))
            .AfterMap((exam, examScore, context) =>
            {
                examScore.StudentAnswers = exam.Students.LeftOuterJoin(exam.Scores, student => student.Id, score => score.Student.Id,
                    (student, scoreExam) =>
                    {
                        var studentWithScore = context.Mapper.Map<StudentAnswer>(student);
                        if (scoreExam is not null)
                        {
                            studentWithScore.Score = scoreExam.Point;
                        }
                        return studentWithScore;
                    }
                ).ToList();
            });
        CreateMap<Question, QuestionAnswer>();
        CreateMap<AnswerQuestion, AnswerSelect>().Ignore(x => x.Selected);

    }

    private IMappingExpression<TSource, TDestination> CreateMapAccount<TSource, TDestination>() where TSource : Account where TDestination : AccountDto
    {
        return CreateMap<TSource, TDestination>().IncludeBase<Account, AccountDto>();
    }

    private IMappingExpression<TSource, TDestination> CreateMapEntity<TSource, TDestination>(MemberList memberList = MemberList.Destination) where TSource : BaseDomain where TDestination : BaseDomainDto
    {
        return CreateMap<TSource, TDestination>(memberList).IncludeBase<BaseDomain, BaseDomainDto>();
    }
}