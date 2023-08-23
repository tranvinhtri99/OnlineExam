export class QuestionExamModel {
  public id?:number;
  public text?:string;
  public level?:number;
  public answers:AnswerExam[] = [];
}

export class AnswerExam{
  public id?:number;
  public answer?:string;
  public selected:boolean = false;
}
