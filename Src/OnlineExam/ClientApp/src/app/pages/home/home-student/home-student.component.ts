import { Component, OnInit } from '@angular/core';
import {ExamService} from "../../../services/exam.service";
import {ExamJoinModel} from "../../../models/exam-models/exam-join-model";

@Component({
  selector: 'app-home-student',
  templateUrl: './home-student.component.html',
})
export class HomeStudentComponent implements OnInit {

  public exams:ExamJoinModel[] = [];

  constructor(
    private examService:ExamService,
  ) { }

  ngOnInit(): void {
    this.examService.GetExamJoin().then(exams => {
      if (exams){
        this.exams = exams;
      }
    })
  }

}
