import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {URL_API} from "../common/constants/GlobalConstants";
import {BaseResponse} from "../common/baseResponses/baseResponse";
import {Classroom} from "../models/classroom-models/classroom";
import {CreateClassroomModel} from "../models/classroom-models/create-classroom-model";
import {UpdateClassroomModel} from "../models/classroom-models/update-classroom-model";
import {showSnackbar, snackbarError, snackbarSuccess} from "../common/functionStatic/show-snackbar";

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {

  constructor(private client: HttpClient) {

  }

  protected get UrlService(){
    return URL_API + "Classroom";
  }

  public async GetAll():Promise<Classroom[] | null> {
    try {
      const response = await this.client.get<BaseResponse<Classroom[]>>(this.UrlService).toPromise();
      if (response.data != null){
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("get classrooms failed");
    }
    return  null;

  }

  public async CreateClassroom(model:CreateClassroomModel):Promise<Classroom | null>{
    try {
      const response = await this.client.post<BaseResponse<Classroom>>(this.UrlService, model).toPromise();
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

  public async UpdateClassroom(model: UpdateClassroomModel):Promise<Classroom|null>{
    try {
      const response = await this.client.put<BaseResponse<Classroom>>(this.UrlService, model).toPromise();
      if (response.data != null){
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
    snackbarError("Update failed");
    }
    return  null;

  }

  public async DeleteClassroom(id:number):Promise<boolean|null>{
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
