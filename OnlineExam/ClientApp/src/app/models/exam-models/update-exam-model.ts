import {BaseModel} from "../../common/baseDto/base-model";
import {Subject} from "../subject-models/subject";
import {Classroom} from "../classroom-models/classroom";
import {Account} from "../account-models/account";

export class UpdateExamModel extends BaseModel {
  public name?:string;
  public start?:Date;
  public time?:number;
  public subject?:Subject;
  public classrooms?:Classroom[];
  public student?:Account[];
}
