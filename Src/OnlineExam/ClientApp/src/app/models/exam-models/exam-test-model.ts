import {TypeQuestion} from "../question-models/question";
import {Subject} from "../subject-models/subject";
import {QuestionExamModel} from "../question-models/question-exam-model";


export class ExamTestModel {
  public name?:string;
  public start?:Date;
  public time?:number;
  public timeCountDown?:number; // seconds
  public subject?:Subject;
  public questions:QuestionExamModel[] = [];
}
