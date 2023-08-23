import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ExamService} from "../../../services/exam.service";
import {UpdateExamModel} from "../../../models/exam-models/update-exam-model";
import {SubjectService} from "../../../services/subject.service";
import {ClassroomService} from "../../../services/classroom.service";
import {Subject} from "../../../models/subject-models/subject";
import {Classroom} from "../../../models/classroom-models/classroom";

@Component({
  selector: 'app-update-question',
  templateUrl: './update-exam.component.html',
  styles: [`
    mat-form-field{
      width: 95%;
    }
    div[mat-dialog-content] > p{
      text-align: center;
    }
  `]
})
export class UpdateExamComponent implements OnInit {

  public data:UpdateExamModel = new UpdateExamModel();
  public subjects:Subject[] = [];
  public classrooms:Classroom[] = [];

  constructor(
    public dialogRef: MatDialogRef<UpdateExamModel>,
    private service:ExamService,
    @Inject(MAT_DIALOG_DATA) public dataOrigin: UpdateExamModel,
    private serviceSubject:SubjectService,
    private serviceClassroom:ClassroomService,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    Object.assign(this.data, this.dataOrigin);

    this.serviceSubject.GetAll().then(subjects => {
      if (subjects)
        this.subjects = subjects;
    })

    this.serviceClassroom.GetAll().then(classrooms => {
      if (classrooms)
        this.classrooms = classrooms;
    })
  }

  submit(){
    this.dialogRef.close(this.data);
  }
}
