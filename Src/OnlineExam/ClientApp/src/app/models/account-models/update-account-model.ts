import {BaseModel} from "../../common/baseDto/base-model";
import {TypeAccount} from "./create-account-model";

export class UpdateAccountModel extends BaseModel {
  public username?:string;
  public name?:string;
  public type?:TypeAccount;
}
