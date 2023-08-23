import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {CreateSubjectModel} from "../../../models/subject-models/create-subject-model";
import {SubjectService} from "../../../services/subject.service";

@Component({
  selector: 'app-create-question',
  templateUrl: './create-subject.component.html',
  styles: [`
    mat-form-field{
      width: 95%;
    }
    div[mat-dialog-content] > p{
      text-align: center;
    }
  `]
})
export class CreateSubjectComponent implements OnInit {

  public data : CreateSubjectModel = new CreateSubjectModel();

  constructor(
    public dialogRef: MatDialogRef<CreateSubjectComponent>,
    private service:SubjectService,
    ) { }

  ngOnInit(): void {
  }

  submit() {
    console.log(this.data);
    this.dialogRef.close(this.data)
  }
}
