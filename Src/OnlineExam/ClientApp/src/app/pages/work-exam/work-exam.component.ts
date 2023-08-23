import {Component, Input, OnInit} from '@angular/core';
import {LoginStore} from "../../common/baseServices/login-store";
import {ActivatedRoute, Router} from "@angular/router";
import {ExamService} from "../../services/exam.service";
import {ExamTestModel} from "../../models/exam-models/exam-test-model";
import {openDialogConfig} from "../../common/functionStatic/open-dialog";
import {CreateExamModel} from "../../models/exam-models/create-exam-model";
import {MatDialog} from "@angular/material/dialog";
import {ViewScoreExamComponent} from "./view-score-exam/view-score-exam.component";
import {ScoreExam} from "../../models/score-models/scoreExam";

@Component({
  selector: 'app-work-exam[exam]',
  templateUrl: './work-exam.component.html',
})
export class WorkExamComponent implements OnInit {

  public idExam:number;

  constructor(
    public login:LoginStore,
    private route: ActivatedRoute,
    private router:Router,
    private service:ExamService,
    private dialog:MatDialog,
  ) {
    this.idExam = parseInt(route.snapshot.paramMap.get("id") ?? "0");
    if (this.idExam <= 0){
      this.router.navigate([""])
    }
  }

  public exam?:ExamTestModel;
  public accountName?:string;

  private submitted:boolean = false;

  ngOnInit(): void {
    if (this.idExam <= 0) return;
    this.accountName = this.login.state?.account?.name;

    this.service.GetExamTest(this.idExam).then(exam => {
      if (exam){
        this.exam = exam;
      }else{
        this.router.navigate([""])
      }
    });
  }

  handleSubmitExam():void{
    this.service.SubmitExam(this.idExam, this.exam?.questions!).then(score => {
      if (score){
        openDialogConfig<ViewScoreExamComponent, ScoreExam, ScoreExam>(this.dialog, ViewScoreExamComponent, {
          width:"750px",
          data:score,
          disableClose:false
        }).then(() => this.router.navigate([""]));
      }
    })
  }


  submitExam(){
    if (this.submitted) return;
    this.submitted = true;

    this.handleSubmitExam();
  }

}
