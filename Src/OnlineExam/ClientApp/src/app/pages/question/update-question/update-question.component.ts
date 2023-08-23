import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {QuestionService} from "../../../services/question.service";
import {UpdateQuestionModel} from "../../../models/question-models/update-question-model";
import {SubjectService} from "../../../services/subject.service";
import {Subject} from "../../../models/subject-models/subject";
import {addItem, removeLastItem} from "../../../common/functionStatic/update-data";
import {AnswerCreateQuestion} from "../../../models/question-models/create-question-model";
import {Question, statesTypeQuestion} from "../../../models/question-models/question";

@Component({
  selector: 'app-update-question',
  templateUrl: './update-question.component.html',
  styles: [`
    mat-form-field{
      width: 95%;
    }
    div[mat-dialog-content] > p {
      text-align: center;
    }
  `]
})
export class UpdateQuestionComponent implements OnInit {

  public data:UpdateQuestionModel = new UpdateQuestionModel();
  public stateTypes = statesTypeQuestion;
  public subjects:Subject[] = [];

  constructor(
    public dialogRef: MatDialogRef<UpdateQuestionModel>,
    private service:QuestionService,
    @Inject(MAT_DIALOG_DATA) public dataOrigin: Question,
    private serviceSubject:SubjectService,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    Object.assign(this.data, this.dataOrigin);
    this.data.subjectId = this.dataOrigin.subject?.id;
    this.serviceSubject.GetAll().then(subjects => {
      if (subjects){
        this.subjects = subjects;
      }
    });
    this.updateUI();
  }

  submit(){
    this.dialogRef.close(this.data);
  }

  addAnswer():void{
    this.data.answers = addItem(this.data.answers, new AnswerCreateQuestion())
  }

  removeAnswer():void{
    this.data.answers = removeLastItem(this.data.answers);
  }

  updateUI(): void{
    this.ref.detectChanges();
  }
}
