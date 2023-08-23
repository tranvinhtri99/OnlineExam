import {Dictionary} from "../account-models/create-account-model";

export class CreateExamModel {
  public name?:string;
  public start?:Date;
  public time?:number;
  public subjectId?:number;
  public levelQuestions:Dictionary<number, number>[] = [];
  public classroomsId:number[] = [];
}
