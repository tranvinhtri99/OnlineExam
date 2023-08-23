import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {URL_API} from "../common/constants/GlobalConstants";
import {Subject} from "../models/subject-models/subject";
import {BaseResponse} from "../common/baseResponses/baseResponse";
import {snackbarError} from "../common/functionStatic/show-snackbar";
import {Score} from "../models/score-models/scoreExam";

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private client: HttpClient) {

  }

  protected get UrlService(){
    return URL_API + "Score";
  }

  public async GetAll():Promise<Score[] | null> {
    try {
      const response = await this.client.get<BaseResponse<Score[]>>(this.UrlService).toPromise();
      if (response.data != null){
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("get subjects failed");
    }
    return  null;

  }
}
