import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {URL_API} from "../common/constants/GlobalConstants";
import {LoginModel} from "../models/authenticationModes/loginModel";
import {LoginResponse} from "../models/responses/loginResponse";
import {BaseResponse} from "../common/baseResponses/baseResponse";
import {Subject} from "../models/subject-models/subject";
import {CreateSubjectModel} from "../models/subject-models/create-subject-model";
import {UpdateSubjectModel} from "../models/subject-models/update-subject-model";
import {showSnackbar, snackbarError, snackbarSuccess} from "../common/functionStatic/show-snackbar";

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private client: HttpClient) {

  }

  protected get UrlService(){
    return URL_API + "Subject";
  }

  public async GetAll():Promise<Subject[] | null> {
    try {
      const response = await this.client.get<BaseResponse<Subject[]>>(this.UrlService).toPromise();
      if (response.data != null){
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("get subjects failed");
    }
    return  null;

  }

  public async CreateSubject(model:CreateSubjectModel):Promise<Subject | null>{
    try {
      const response = await this.client.post<BaseResponse<Subject>>(this.UrlService, model).toPromise();
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

  public async UpdateSubject(model: UpdateSubjectModel):Promise<Subject|null>{
    try {
      const response = await this.client.put<BaseResponse<Subject>>(this.UrlService, model).toPromise();
      if (response.data != null){
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
    snackbarError("Update failed");
    }
    return  null;

  }

  public async DeleteSubject(id:number):Promise<boolean|null>{
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
}
