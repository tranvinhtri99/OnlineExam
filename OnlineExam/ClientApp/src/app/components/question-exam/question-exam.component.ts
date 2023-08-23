import {Component, Input, OnInit} from '@angular/core';
import {QuestionExamModel} from "../../models/question-models/question-exam-model";

@Component({
  selector: 'app-question-exam[question]',
  templateUrl: './question-exam.component.html',
})
export class QuestionExamComponent implements OnInit {

  @Input() question!:QuestionExamModel
  @Input() index?:number|string;
  public columnEmpty:number[] = [];
  public indexQuestion:number = 1;
  public percentWidth = 100;
  constructor() { }

  ngOnInit(): void {
    const lengthAnswer = this.question.answers?.reduce((accumulator, current) => {
      return accumulator + (current.answer?.length ?? 0);
    }, 0)

    if (this.index){
      this.indexQuestion = (typeof this.index === "string") ? parseInt(this.index) + 1 : this.index + 1;
    }

    let colAnswer = 1;

    if (lengthAnswer < 50){
      colAnswer = 4;
    }else if (lengthAnswer < 25){
      colAnswer = 2;
    }

    this.percentWidth = 100/colAnswer;
    if (colAnswer > this.question.answers.length){
      this.columnEmpty = Array.apply(null, Array(colAnswer - this.question.answers.length)).map(function (x, i) { return i; });
    }

  }

}
