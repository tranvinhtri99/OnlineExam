import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {CreateAccountModel, statesTypeAccount} from "../../../models/account-models/create-account-model";
import {AccountService} from "../../../services/account.service";
import {ClassroomService} from "../../../services/classroom.service";
import {Classroom} from "../../../models/classroom-models/classroom";

@Component({
  selector: 'app-create-question',
  templateUrl: './create-account.component.html',
  styles: [`
    mat-form-field{
      width: 95%;
    }
    div[mat-dialog-content] > p{
      text-align: center;
    }
  `]
})
export class CreateAccountComponent implements OnInit {

  public data : CreateAccountModel = new CreateAccountModel();
  public stateTypes = statesTypeAccount;

  public classrooms:Classroom[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateAccountComponent>,
    private service:AccountService,
    private classroomService:ClassroomService,
    ) { }

  ngOnInit(): void {
    this.classroomService.GetAll().then(clasrooms => {
      if (clasrooms){
        this.classrooms = clasrooms;
      }
    })
  }

  submit() {
    console.log(this.data);
    this.dialogRef.close(this.data)
  }
}
