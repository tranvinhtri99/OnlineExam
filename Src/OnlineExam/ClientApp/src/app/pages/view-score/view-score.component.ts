import { Component, OnInit } from '@angular/core';
import {ScoreService} from "../../services/score.service";
import {Score} from "../../models/score-models/scoreExam";

@Component({
  selector: 'app-view-score',
  templateUrl: './view-score.component.html',
})
export class ViewScoreComponent implements OnInit {

  public dataSource: Score[] = [];
  public displayedColumns: string[] = ['stt', 'exam', 'subject', 'score'];

  constructor(
    private service: ScoreService
  ) { }

  ngOnInit(): void {
    this.service.GetAll().then(scores => {
      if (scores){
        this.dataSource = scores;
      }
    })
  }

}
