import {Component, OnInit} from '@angular/core';
import {LoginStore, tokenAccount, typeAccountCurrent} from "../../common/baseServices/login-store";
import {Router} from "@angular/router";
import {ExamJoinModel} from "../../models/exam-models/exam-join-model";
import {QuestionExamModel} from "../../models/question-models/question-exam-model";
import {TypeAccount} from "../../models/account-models/create-account-model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{

  public constructor(public loginStore:LoginStore, private router:Router) {
  }

  public questions: QuestionExamModel[] = [];

  public typeAccount?: TypeAccount ;

  ngOnInit(): void {
    if (this.loginStore.state == null){
      this.router.navigate(["signIn"])
      return;
    }

    this.typeAccount = typeAccountCurrent ?? undefined;

  }
}
