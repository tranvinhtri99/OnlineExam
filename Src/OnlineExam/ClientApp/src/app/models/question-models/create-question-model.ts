import {TypeQuestion} from "./question";

export class CreateQuestionModel {
  public type:TypeQuestion = TypeQuestion.Quiz;
  public text?:string;
  public level?:number;
  public answers:AnswerCreateQuestion[] = [
    new AnswerCreateQuestion(),
    new AnswerCreateQuestion(),
    new AnswerCreateQuestion()
  ];
  public subjectId?:number;

  public checkQuestionValid(): boolean {
    return !!this.text || !!this.level || !!this.subjectId;
  }
}

export class AnswerCreateQuestion{
  public answer:string = "";
  public correct:boolean = false;
}
