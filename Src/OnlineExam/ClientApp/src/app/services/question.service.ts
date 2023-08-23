import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {URL_API} from "../common/constants/GlobalConstants";
import {BaseResponse} from "../common/baseResponses/baseResponse";
import {Question} from "../models/question-models/question";
import {CreateQuestionModel} from "../models/question-models/create-question-model";
import {UpdateQuestionModel} from "../models/question-models/update-question-model";
import {snackbarError, snackbarSuccess} from "../common/functionStatic/show-snackbar";
import {Dictionary} from "../models/account-models/create-account-model";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private client: HttpClient) {

  }

  protected get UrlService() {
    return URL_API + "Question";
  }

  public async GetAll(search: string | null = null): Promise<Question[] | null> {
    try {
      let url = this.UrlService;
      if (search != null) {
        url += "?search=" + encodeURIComponent(search);
      }
      const response = await this.client.get<BaseResponse<Question[]>>(url, {headers: {}}).toPromise();
      if (response.data != null) {
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("get questions failed");
    }
    return null;
  }

  public async CreateQuestion(model: CreateQuestionModel): Promise<Question | null> {
    try {
      const response = await this.client.post<BaseResponse<Question>>(this.UrlService, model).toPromise();
      if (response.data != null) {
        snackbarSuccess("Add success")
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Add failed");
    }
    return null;
  }

  public async UpdateQuestion(model: UpdateQuestionModel): Promise<Question | null> {
    try {
      const response = await this.client.put<BaseResponse<Question>>(this.UrlService, model).toPromise();
      if (response.data != null) {
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Update failed");
    }
    return null;

  }

  public async DeleteQuestion(id: number): Promise<boolean | null> {
    try {
      const response = await this.client.delete<BaseResponse<boolean>>(this.UrlService + "/" + id).toPromise();
      if (response.data != null) {
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Delete failed");
    }
    return null;
  }


  public async GetLevelCountQuestions(subjectId: number): Promise<Dictionary<number, number>[] | null> {
    try {
      const response = await this.client.get<BaseResponse<Dictionary<number, number>[]>>(this.UrlService + "/CountQuestion/" + subjectId).toPromise();
      if (response.data != null) {
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("get questions failed");
    }
    return null;
  }
}
