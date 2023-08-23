import { Component, OnInit } from '@angular/core';
import {AnswerCreateQuestion, CreateQuestionModel} from "../../../models/question-models/create-question-model";
import {QuestionService} from "../../../services/question.service";

@Component({
  selector: 'app-upload-question',
  templateUrl: './upload-question.component.html',
  styles:[`
    .wrapper-question{
      margin: 20px 10px;
    }

    .count-question-success{
      background: #78d208;
    }

    .count-question-fail{
      background: #d20021;
    }
  `]
})
export class UploadQuestionComponent implements OnInit {

  public countQuestion:number = 0;
  public countQuestionFail:number = 0;
  public countQuestionSuccess:number = 0;
  public percentProgress:number = 0;

  public uploading:boolean = false;
  public uploaded:boolean = false;

  public questions:CreateQuestionModel[] = [];

  constructor(
    private service:QuestionService,
  ) { }

  ngOnInit(): void {
  }

  dataFromEventEmitter(data:any[]):void{
    this.countQuestion = data.length;

    var countQuestionValid = 0;

    for (let i = 0; i < data.length; i++){
      let item = data[i];

      let createQuestion = new CreateQuestionModel();
      createQuestion.text = item.text;
      createQuestion.level = item.level;
      createQuestion.subjectId = item.subjectId;
      if (!createQuestion.checkQuestionValid()) continue;
      createQuestion.answers = [];

      for(let j = 1; ; j++) {
        let answer = item["answer" + j];
        let correct = item["correct" + j];
        if (answer === "" || answer == null || correct == null) break;

        let answerQuestion = new AnswerCreateQuestion();
        answerQuestion.answer = answer.toString();
        answerQuestion.correct = (correct === "True" || correct === "true" || correct === 1 || correct === "1" || correct === true);

        createQuestion.answers.push(answerQuestion);
      }

      countQuestionValid++;
      this.questions.push(createQuestion);
    }

    this.countQuestionFail = this.countQuestion - countQuestionValid;
    console.log(this.questions);
  }

  async uploadQuestion() {
    this.uploading = true;

    for (const question of this.questions) {
      const result = await this.service.CreateQuestion(question);
      if (result){
        this.countQuestionSuccess++;
      }else{
        this.countQuestionFail++;
      }

      this.percentProgress = (this.countQuestionFail + this.countQuestionSuccess) / this.countQuestion * 100;
    }

    this.uploading = false;
    this.uploaded = true;
  }

}
