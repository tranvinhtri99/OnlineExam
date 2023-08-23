import { Component, OnInit } from '@angular/core';
import {Account} from "../../models/account-models/account";
import {ScoreExam} from "../../models/score-models/scoreExam";

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
})
export class ScoreComponent implements OnInit {


  public dataSource: ScoreExam[] = [];
  public displayedColumns: string[] = ['id', 'exam', 'score'];

  constructor() { }

  ngOnInit(): void {  }

}
