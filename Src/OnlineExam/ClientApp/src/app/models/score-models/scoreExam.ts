import {Exam} from "../exam-models/exam";
import {Account} from "../account-models/account";

export class ScoreExam {
  public id?:number;
  public point?:number;
  public exam?:Exam;
  public student?:Account;
}


export class Score {
  public id?:number;
  public score?:number;
  public examName?:string;
  public subjectName?:string;
}
