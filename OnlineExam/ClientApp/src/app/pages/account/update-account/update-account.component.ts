import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AccountService} from "../../../services/account.service";
import {convertTypeAccount, statesTypeAccount, TypeAccount} from "../../../models/account-models/create-account-model";
import {UpdateAccountModel} from "../../../models/account-models/update-account-model";
import {Account} from "../../../models/account-models/account";

@Component({
  selector: 'app-update-question',
  templateUrl: './update-account.component.html',
  styles: [`
    mat-form-field{
      width: 95%;
    }
    div[mat-dialog-content] > p {
      text-align: center;
    }
  `]
})
export class UpdateAccountComponent implements OnInit {

  public data:UpdateAccountModel = new UpdateAccountModel();
  public stateTypes = statesTypeAccount;

  constructor(
    public dialogRef: MatDialogRef<UpdateAccountModel>,
    private service:AccountService,
    @Inject(MAT_DIALOG_DATA) public dataOrigin: Account
  ) { }

  ngOnInit(): void {
    Object.assign(this.data, this.dataOrigin);
    this.data.type = convertTypeAccount(this.dataOrigin.type ?? "Student");
  }

  submit(){
    this.dialogRef.close(this.data);
  }
}
