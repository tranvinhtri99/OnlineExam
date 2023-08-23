import {BaseDto, IKeyId} from "../responses/baseDto";
import {Subject} from "../subject-models/subject";
import {Dictionary} from "../account-models/create-account-model";


export class Question extends BaseDto{
  public type:TypeQuestion = TypeQuestion.Quiz;
  public text?:string;
  public level?:number;
  public answers:Answer[] = [];
  public subject?:Subject;
}

export class Answer implements IKeyId{
  public id?:number;
  // public questionId?:number;
  public answer?:string;
  public correct?:boolean;
}

export enum TypeQuestion{
  Quiz,
  Essay
}

export const statesTypeQuestion:Dictionary<number, string>[] = (Object.values(TypeQuestion).filter(value => typeof value === 'number') as number[])
  .map(x => { return  {key:x, value:TypeQuestion[x]}})
