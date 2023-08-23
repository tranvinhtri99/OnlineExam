import {Component, OnInit} from '@angular/core';
import { MatDialogRef} from "@angular/material/dialog";
import {AnswerCreateQuestion, CreateQuestionModel} from "../../../models/question-models/create-question-model";
import {QuestionService} from "../../../services/question.service";
import {statesTypeQuestion} from "../../../models/question-models/question";
import {SubjectService} from "../../../services/subject.service";
import {Subject} from "../../../models/subject-models/subject";
import {addItem, removeLastItem} from "../../../common/functionStatic/update-data";

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styles: [`
    mat-form-field{
      width: 95%;
    }
    div[mat-dialog-content] > p{
      text-align: center;
    }
  `]
})
export class CreateQuestionComponent implements OnInit {

  public data : CreateQuestionModel = new CreateQuestionModel();
  public stateTypes = statesTypeQuestion;
  public subjects:Subject[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateQuestionComponent>,
    private service:QuestionService,
    private serviceSubject:SubjectService
    ) { }

  ngOnInit(): void {
    this.serviceSubject.GetAll().then(subjects => {
      if (subjects){
        this.subjects = subjects;
        if (subjects.length > 0)
          this.data.subjectId = subjects[0].id;
      }
    })
  }

  submit() {
    console.log(this.data);
    this.dialogRef.close(this.data)
  }

  addAnswer():void{
    this.data.answers = addItem(this.data.answers, new AnswerCreateQuestion())
  }

  removeAnswer():void{
    this.data.answers = removeLastItem(this.data.answers);
  }
}
