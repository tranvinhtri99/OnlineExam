import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SubjectService} from "../../../services/subject.service";
import {UpdateSubjectModel} from "../../../models/subject-models/update-subject-model";

@Component({
  selector: 'app-update-question',
  templateUrl: './update-subject.component.html',
  styles: [`
    mat-form-field{
      width: 95%;
    }
    div[mat-dialog-content] > p{
      text-align: center;
    }
  `]
})
export class UpdateSubjectComponent implements OnInit {

  public data:UpdateSubjectModel = new UpdateSubjectModel();

  constructor(
    public dialogRef: MatDialogRef<UpdateSubjectModel>,
    private service:SubjectService,
    @Inject(MAT_DIALOG_DATA) public dataOrigin: UpdateSubjectModel
  ) { }

  ngOnInit(): void {
    Object.assign(this.data, this.dataOrigin);
  }

  submit(){
    this.dialogRef.close(this.data);
  }
}
