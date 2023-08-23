import {BaseModel} from "../../common/baseDto/base-model";

export class UpdateClassroomModel extends BaseModel {
  public code?:number;
  public name?:string;
  public noCredit?:number;
}
