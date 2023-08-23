import {BaseDto} from "../responses/baseDto";


export class Subject extends BaseDto{
  public code?:number;
  public name?:string;
  public noCredit?:number;
}
