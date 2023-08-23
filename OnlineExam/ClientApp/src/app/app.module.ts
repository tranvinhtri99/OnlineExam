import { ApiService } from './common/baseServices/apiService';
import { BrowserModule } from '@angular/platform-browser';
import {Injector, NgModule, Type} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './pages/home/home.component';
import { FetchDataComponent } from './pages/fetch-data/fetch-data.component';

import { LoginComponent } from './pages/login/login.component';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './helper/angular-material.module';
import {JsonSerializer} from "typescript-json-serializer";
import {LoginStore} from "./common/baseServices/login-store";
import {mainRouter} from "./helper/define-router";
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import {SubjectComponent} from "./pages/subject/subject.component";
import {CreateSubjectComponent} from "./pages/subject/create-subject/create-subject.component";
import {UpdateSubjectComponent} from "./pages/subject/update-subject/update-subject.component";
import {ClassroomComponent} from "./pages/classroom/classroom.component";
import {CreateClassroomComponent} from "./pages/classroom/create-classroom/create-classroom.component";
import {UpdateClassroomComponent} from "./pages/classroom/update-classroom/update-classroom.component";
import {SubjectStore} from "./common/baseServices/subject-store";
import {ClassroomStore} from "./common/baseServices/classroom-store";
import {AccountComponent} from "./pages/account/account.component";
import {CreateAccountComponent} from "./pages/account/create-account/create-account.component";
import {UpdateAccountComponent} from "./pages/account/update-account/update-account.component";
import {ConfirmDialogComponent} from "./components/confirm-dialog/confirm-dialog.component";
import {AddHeaderInterceptor} from "./common/add-header-interceptor";
import { UploadAccountComponent } from './pages/account/upload-account/upload-account.component';
import { ReadexcelDirective } from './common/directives/readexcel-directive.directive';
import {QuestionComponent} from "./pages/question/question.component";
import {CreateQuestionComponent} from "./pages/question/create-question/create-question.component";
import {UpdateQuestionComponent} from "./pages/question/update-question/update-question.component";
import {UploadQuestionComponent} from "./pages/question/upload-question/upload-question.component";
import { JoinAnswerPipe } from './common/pipes/join-answer.pipe';
import { JsonSubjectPipe } from './common/pipes/json-subject.pipe';
import {ExamComponent} from "./pages/exam/exam.component";
import {CreateExamComponent} from "./pages/exam/create-exam/create-exam.component";
import {UpdateExamComponent} from "./pages/exam/update-exam/update-exam.component";
import { JsonArrayPipe } from './common/pipes/json-array.pipe';
import { JoinExamComponent } from './components/join-exam/join-exam.component';
import { QuestionExamComponent } from './components/question-exam/question-exam.component';
import { WorkExamComponent } from './pages/work-exam/work-exam.component';
import { CountDownComponent } from './components/count-down/count-down.component';
import { FormatTimePipe } from './common/pipes/format-time.pipe';
import { ExamDetailComponent } from './pages/exam-detail/exam-detail.component';
import { ScoreComponent } from './pages/score/score.component';
import { HomeStudentComponent } from './pages/home/home-student/home-student.component';
import { ViewScoreExamComponent } from './pages/work-exam/view-score-exam/view-score-exam.component';
import { ViewScoreComponent } from './pages/view-score/view-score.component';

registerLocaleData(en);

export let AppInjector: Injector;

const componentsPages: Array<Type<any> | any[]> = [
  SubjectComponent,
  CreateSubjectComponent,
  UpdateSubjectComponent,
  ClassroomComponent,
  CreateClassroomComponent,
  UpdateClassroomComponent,
  AccountComponent,
  CreateAccountComponent,
  UpdateAccountComponent,
  UploadAccountComponent,
  QuestionComponent,
  CreateQuestionComponent,
  UpdateQuestionComponent,
  UploadQuestionComponent,
  ExamComponent,
  CreateExamComponent,
  UpdateExamComponent
]

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    FetchDataComponent,
    LoginComponent,
    SnackbarComponent,
    ConfirmDialogComponent,
    componentsPages,
    ReadexcelDirective,
    JoinAnswerPipe,
    JsonSubjectPipe,
    JsonArrayPipe,
    JoinExamComponent,
    QuestionExamComponent,
    WorkExamComponent,
    CountDownComponent,
    FormatTimePipe,
    ExamDetailComponent,
    ScoreComponent,
    HomeStudentComponent,
    ViewScoreExamComponent,
    ViewScoreComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    mainRouter,
    BrowserAnimationsModule,
    AngularMaterialModule,
  ],
  providers: [
    {provide:JsonSerializer, useValue: new JsonSerializer()},
    {provide:LoginStore, useValue: new LoginStore()},
    {provide:SubjectStore, useValue: new SubjectStore()},
    {provide:ClassroomStore, useValue: new ClassroomStore()},
    {provide:HTTP_INTERCEPTORS,useClass: AddHeaderInterceptor,multi: true},
      HttpClient, ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
}
