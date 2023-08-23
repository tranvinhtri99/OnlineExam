import {BaseDto} from "../responses/baseDto";
import {Subject} from "../subject-models/subject";
import {Question} from "../question-models/question";
import {Classroom} from "../classroom-models/classroom";
import {Account, StudentWithScore} from "../account-models/account";
import {ScoreExam} from "../score-models/scoreExam";

export class Exam extends BaseDto{
  public name?:string;
  public start?:Date;
  public time?:number;
  public subject?:Subject;
  public countQuestion?:number;
  public countStudents?:number;
  public countScores?:number;
}

export class ExamDetail extends BaseDto{
  public name?:string;
  public start?:Date;
  public time?:number;
  public subject?:Subject;
  public questions:Question[] = [];
  public students:Account[] = [];
  public scores:ScoreExam[] = [];
}

export class ExamScore extends BaseDto{
  public name?:string;
  public start?:Date;
  public time?:number;
  public subject?:Subject;

  public countScore?:number;
  public countQuestion?:number;
  public studentWithScores:StudentWithScore[] = [];
}
