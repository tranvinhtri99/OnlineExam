import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SubjectService} from "../../../services/subject.service";
import {ScoreExam} from "../../../models/score-models/scoreExam";

@Component({
  selector: 'app-view-score-exam',
  templateUrl: './view-score-exam.component.html',
})
export class ViewScoreExamComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ScoreExam>,
    private service:SubjectService,
    @Inject(MAT_DIALOG_DATA) public score:ScoreExam,
  ) { }

  ngOnInit(): void {
  }

}
