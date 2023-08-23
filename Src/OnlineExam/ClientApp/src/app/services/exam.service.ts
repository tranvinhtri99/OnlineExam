import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {URL_API} from "../common/constants/GlobalConstants";
import {BaseResponse} from "../common/baseResponses/baseResponse";
import {Exam, ExamDetail, ExamScore} from "../models/exam-models/exam";
import {CreateExamModel} from "../models/exam-models/create-exam-model";
import {UpdateExamModel} from "../models/exam-models/update-exam-model";
import {snackbarError, snackbarSuccess} from "../common/functionStatic/show-snackbar";
import {ExamTestModel} from "../models/exam-models/exam-test-model";
import {ExamStudentModel} from "../models/exam-models/exam-student-model";
import {Account} from "../models/account-models/account";
import {ExamJoinModel} from "../models/exam-models/exam-join-model";
import {QuestionExamModel} from "../models/question-models/question-exam-model";
import {ScoreExam} from "../models/score-models/scoreExam";

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private client: HttpClient) {

  }

  public get UrlService() {
    return URL_API + "Exam";
  }

  public async GetAll(): Promise<Exam[] | null> {
    try {
      const {data, error} = await this.client.get<BaseResponse<Exam[]>>(this.UrlService).toPromise();
      if (data != null) {
        return data;
      }
      snackbarError(error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("get exams failed");
    }
    return null;

  }

  public async CreateExam(model: CreateExamModel): Promise<Exam | null> {
    try {
      const {data, error} = await this.client.post<BaseResponse<Exam>>(this.UrlService, model).toPromise();
      if (data != null) {
        snackbarSuccess("Add success")
        return data;
      }
      snackbarError(error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Add failed");
    }
    return null;
  }

  public async UpdateExam(model: UpdateExamModel): Promise<Exam | null> {
    try {
      const {data, error} = await this.client.put<BaseResponse<Exam>>(this.UrlService, model).toPromise();
      if (data != null) {
        return data;
      }
      snackbarError(error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Update failed");
    }
    return null;

  }

  public async DeleteExam(id: number): Promise<boolean | null> {
    try {
      const {data, error} = await this.client.delete<BaseResponse<boolean>>(this.UrlService + "/" + id).toPromise();
      if (data != null) {
        return data;
      }
      snackbarError(error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Delete failed");
    }
    return null;
  }

  public async GetExamTest(id: number): Promise<ExamTestModel | null> {
    try {
      const {data, error} =
        await this.client.get<BaseResponse<ExamTestModel>>(this.UrlService + "/examtest/" + id).toPromise();
      if (data != null) {
        return data;
      }
      snackbarError(error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Cannot get Exam.");
    }
    return null;
  }

  public async GetExamDetail(id: number): Promise<ExamScore | null> {
    try {
      const {data, error} = await this.client.get<BaseResponse<ExamScore>>(this.UrlService + "/" + id).toPromise();
      if (data != null) {
        return data;
      }
      snackbarError(error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Cannot get Exam");
    }
    return null;
  }

  public async DeleteStudent(idExam: number, idStudent: string): Promise<boolean | null> {
    try {
      const model = new ExamStudentModel(idExam, idStudent);
      const response = await this.client.post<BaseResponse<boolean>>(this.UrlService + "/removeStudent", model).toPromise();
      if (response.data != null) {
        return response.data;
      }
      snackbarError(response.error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Delete failed");
    }
    return null;
  }

  public async AddStudent(idExam: number, idStudent: number | string): Promise<Account | null> {
    try {
      const model = new ExamStudentModel(idExam, idStudent);
      const {
        data,
        error
      } = await this.client.post<BaseResponse<Account>>(this.UrlService + "/addStudent", model).toPromise();
      if (data != null) {
        return data;
      }
      snackbarError(error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Add Student failed");
    }
    return null;
  }

  public async GetExamJoin(): Promise<ExamJoinModel[] | null> {
    try {
      const {data, error} =
        await this.client.get<BaseResponse<ExamJoinModel[]>>(this.UrlService + "/examJoin").toPromise();
      if (data != null) {
        return data;
      }
      snackbarError(error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Cannot get exams");
    }
    return null;
  }

  public async SubmitExam(examId: number, questions: QuestionExamModel[]): Promise<ScoreExam | null> {
    try {
      const {data, error} =
        await this.client.post<BaseResponse<ScoreExam>>(this.UrlService + "/examSubmit/" + examId, questions).toPromise();
      if (data != null) {
        return data;
      }
      snackbarError(error?.Message ?? "An error occurred, please try again or contact your administrator");
    } catch (e) {
      snackbarError("Unable to submit, please try again");
    }
    return null;
  }

}
