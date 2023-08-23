import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {CreateClassroomModel} from "../../../models/classroom-models/create-classroom-model";
import {ClassroomService} from "../../../services/classroom.service";

@Component({
  selector: 'app-create-question',
  templateUrl: './create-classroom.component.html',
  styles: [`
    mat-form-field{
      width: 95%;
    }
    div[mat-dialog-content] > p{
      text-align: center;
    }
  `]
})
export class CreateClassroomComponent implements OnInit {

  public data : CreateClassroomModel = new CreateClassroomModel();

  constructor(
    public dialogRef: MatDialogRef<CreateClassroomComponent>,
    private service:ClassroomService,
    ) { }

  ngOnInit(): void {
  }

  submit() {
    console.log(this.data);
    this.dialogRef.close(this.data)
  }
}
