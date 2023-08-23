import {Injectable} from "@angular/core";
import {Store} from "./store";
import {LoginResponse} from "../../models/responses/loginResponse";
import {HttpClient} from "@angular/common/http";
import {convertTypeAccount, TypeAccount} from "../../models/account-models/create-account-model";

@Injectable()
export class LoginStore extends Store<LoginResponse | null>{

  public constructor () {
    super(null);
    this.state$.subscribe(x => {
      tokenAccount = x?.token;
      if (x && x.account?.type){
        typeAccountCurrent = convertTypeAccount(x.account?.type);
      }else{
        typeAccountCurrent = null;
      }
    });
  }

  public signOut():void{
    this.setState(null);
  }

  public signIn(account:LoginResponse):void {
    this.setState(account);
  }
}

export let tokenAccount:undefined | string;

export let typeAccountCurrent: TypeAccount | undefined | null;
