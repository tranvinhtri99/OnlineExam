import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ClassroomService} from "../../../services/classroom.service";
import {UpdateClassroomModel} from "../../../models/classroom-models/update-classroom-model";

@Component({
  selector: 'app-update-question',
  templateUrl: './update-classroom.component.html',
  styles: [`
    mat-form-field{
      width: 95%;
    }
    div[mat-dialog-content] > p{
      text-align: center;
    }
  `]
})
export class UpdateClassroomComponent implements OnInit {

  public data:UpdateClassroomModel = new UpdateClassroomModel();

  constructor(
    public dialogRef: MatDialogRef<UpdateClassroomModel>,
    private service:ClassroomService,
    @Inject(MAT_DIALOG_DATA) public dataOrigin: UpdateClassroomModel
  ) { }

  ngOnInit(): void {
    Object.assign(this.data, this.dataOrigin);
  }

  submit(){
    this.dialogRef.close(this.data);
  }
}
