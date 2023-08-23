import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {URL_API} from "../common/constants/GlobalConstants";
import {BaseResponse} from "../common/baseResponses/baseResponse";
import {Account} from "../models/account-models/account";
import {CreateAccountModel, TypeAccount} from "../models/account-models/create-account-model";
import {UpdateAccountModel} from "../models/account-models/update-account-model";
import {snackbarError, snackbarSuccess} from "../common/functionStatic/show-snackbar";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private client: HttpClient) {

  }

  protected get UrlService(){
    return URL_API + "Account";
  }

  public async GetAll():Promise<Account[] | null> {
    try {
      const response = await this.client.get<BaseResponse<Account[]>>(this.UrlService, {headers:{}}).toPromise();
      if (response.data != null){
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("get accounts failed");
    }
    return  null;
  }

  public async CreateAccount(model:CreateAccountModel):Promise<Account | null>{
    try {
      const response = await this.client.post<BaseResponse<Account>>(this.UrlService + "/" + TypeAccount[model.type].toLowerCase(), model).toPromise();
      if (response.data != null){
        snackbarSuccess("Add success")
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
    snackbarError("Add failed");
    }
    return null;
  }

  public async UpdateAccount(model: UpdateAccountModel):Promise<Account|null>{
    try {
      const response = await this.client.put<BaseResponse<Account>>(this.UrlService + "/" + TypeAccount[model.type ?? 0].toLowerCase(), model).toPromise();
      if (response.data != null){
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
    snackbarError("Update failed");
    }
    return  null;

  }

  public async DeleteAccount(id:number):Promise<boolean|null>{
    try {
      const response = await this.client.delete<BaseResponse<boolean>>(this.UrlService + "/" + id).toPromise();
      if (response.data != null){
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Delete failed");
    }
    return null;
  }

  public async ResetPassword(id:number):Promise<string|null>{
    try {
      const response = await this.client.post<BaseResponse<string>>(this.UrlService + "/resetpassword?id=" + id, null).toPromise();
      if (response.data != null){
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Reset password failed");
    }
    return null;
  }
}
