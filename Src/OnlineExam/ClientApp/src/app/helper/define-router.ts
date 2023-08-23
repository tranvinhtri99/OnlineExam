import {AuthGuard} from "./auth-guard";
import {RouterModule} from "@angular/router";
import {HomeComponent} from "../pages/home/home.component";
import {FetchDataComponent} from "../pages/fetch-data/fetch-data.component";
import {LoadingComponent} from "../pages/loading/loading.component";
import {LoginComponent} from "../pages/login/login.component";
import {SubjectComponent} from "../pages/subject/subject.component";
import {ClassroomComponent} from "../pages/classroom/classroom.component";
import {AccountComponent} from "../pages/account/account.component";
import {QuestionComponent} from "../pages/question/question.component";
import {ExamComponent} from "../pages/exam/exam.component";
import {WorkExamComponent} from "../pages/work-exam/work-exam.component";
import {ExamDetailComponent} from "../pages/exam-detail/exam-detail.component";
import {ViewScoreComponent} from "../pages/view-score/view-score.component";

// export const mainRouter = RouterModule.forRoot([
//   { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
//   { path: 'counter', component: CounterComponent, canActivate: [AuthGuard] },
//   { path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthGuard] },
//   { path: 'loading', component: LoadingComponent },
//   { path: 'subject', component: AccountComponent, canActivate: [AuthGuard] },
//   { path: 'signIn', component: LoginComponent },
// ])

export const mainRouter = RouterModule.forRoot([
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'workexam/:id', component: WorkExamComponent, canActivate: [AuthGuard] },
  { path: 'exam', component: ExamComponent, canActivate: [AuthGuard] },
  { path: 'exam/:id', component: ExamDetailComponent, canActivate: [AuthGuard] },
  { path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthGuard] },
  { path: 'loading', component: LoadingComponent , canActivate: [AuthGuard] },
  { path: 'subject', component: SubjectComponent , canActivate: [AuthGuard] },
  { path: 'classroom', component: ClassroomComponent , canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent , canActivate: [AuthGuard] },
  { path: 'question', component: QuestionComponent, canActivate: [AuthGuard]},
  { path: 'score', component: ViewScoreComponent, canActivate: [AuthGuard] },
  { path: 'signIn', component: LoginComponent },
])
