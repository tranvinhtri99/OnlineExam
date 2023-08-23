import {Subject} from "../subject-models/subject";

export class ExamJoinModel {
  public id?:number;
  public name?:string;
  public subject?:Subject;
  public start?:Date;
  public time?:number;
  public countQuestion?:number;
}
