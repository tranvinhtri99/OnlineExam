import {BaseModel} from "../../common/baseDto/base-model";
import {Answer, TypeQuestion} from "./question";

export class UpdateQuestionModel extends BaseModel {
  public type:TypeQuestion = TypeQuestion.Quiz;
  public text?:string;
  public level?:number;
  public answers:Answer[] = [];
  public subjectId?:number;
}
