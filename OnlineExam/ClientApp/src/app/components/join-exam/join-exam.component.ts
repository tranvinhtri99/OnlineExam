import {Component, Input, OnInit} from '@angular/core';
import {ExamJoinModel} from "../../models/exam-models/exam-join-model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-join-exam[exam]',
  templateUrl: './join-exam.component.html',
  styles:[
    `
      .card-join-exam{
        padding: 20px;
      }
    `
  ]
})
export class JoinExamComponent implements OnInit {

  @Input() exam!:ExamJoinModel;
  constructor(
    private router:Router,
  ) { }

  ngOnInit(): void {
  }


  public joinExam(examId:number): void {
    this.router.navigate(["workexam/" + examId])
  }
}
