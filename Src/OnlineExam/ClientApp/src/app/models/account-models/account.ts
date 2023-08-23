import {BaseDto} from "../responses/baseDto";
import {Classroom} from "../classroom-models/classroom";


export class Account extends BaseDto {
  public type?: string;
  public username?: string;
  public name?: string;
  public password?: string;
  public classroom?: Classroom;
}

export class StudentWithScore extends BaseDto {
  public type?: string;
  public username?: string;
  public name?: string;
  public password?: string;
  public classroom?: Classroom;
  public score?: number;
}
