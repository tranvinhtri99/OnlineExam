﻿namespace OnlineExam.Models.Requests.QuestionRequest;

public class UpdateAnswerQuestionDto : IAnswerQuestion
{
    public string Answer { get; set; }
    public bool Correct { get; set; }
}