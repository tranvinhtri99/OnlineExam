import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Account} from "../../models/account-models/account";
import {AccountService} from "../../services/account.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateAccountComponent} from "./create-account/create-account.component";
import {confirmDialog, openDialog, openDialogConfig} from "../../common/functionStatic/open-dialog";
import {UpdateAccountComponent} from "./update-account/update-account.component";
import {CreateAccountModel, TypeAccount} from "../../models/account-models/create-account-model";
import {addItem, deleteItem, updateItem} from "../../common/functionStatic/update-data";
import {UploadAccountComponent} from "./upload-account/upload-account.component";
import {UpdateAccountModel} from "../../models/account-models/update-account-model";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {

  public dataSource: Account[] = [];
  public displayedColumns: string[] = ['id', 'username','name', 'type','password', 'action'];

  constructor(
    private service:AccountService,
    private dialog:MatDialog,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.service.GetAll().then(accounts => {
      if (accounts == null){
        this.dataSource = []
      }else{
        this.dataSource = accounts;
      }
    })
  }

  openModalCreate():void{
    openDialog<CreateAccountComponent, CreateAccountModel, CreateAccountModel>(this.dialog, CreateAccountComponent)
      .then((createAccount) => {
        if (createAccount){
          this.service.CreateAccount(createAccount).then(account => {
            if (account == null){
              return;
            }

            this.dataSource = addItem(this.dataSource, account);
            this.updateUI();
          })
        }
      });
  }

  openModalUpdate(account:Account) {
    openDialog<UpdateAccountComponent, Account, UpdateAccountModel>(this.dialog, UpdateAccountComponent, account).then((updateAccount) => {
      if (updateAccount){
        this.service.UpdateAccount(updateAccount).then(account => {
          if (account == null){
            return;
          }
          this.dataSource = updateItem(this.dataSource, account, x => x.id)
          this.updateUI();
        })
      }
    });
  }

  confirmDelete(account:Account):void {
    confirmDialog(this.dialog, {
      title: "Confirm delete ?",
      message: `Are you sure you want to delete ${account.name}? This operation is irreversible`,
      callback: () => {
        this.service.DeleteAccount(account.id ?? 0).then(success => {
          if (success){
            this.dataSource = deleteItem(this.dataSource, x => x.id == account.id);
            this.updateUI();
          }
        });
      }
    })
  }

  resetPassword(account:Account):void{
    confirmDialog(this.dialog, {
      title: "Confirm ?",
      message: `Are you sure you want to reset password ${account.name}? This operation is irreversible`,
      callback: () => {

        this.service.ResetPassword(account.id ?? 0).then(password => {
          if (password){
            account.password = password;
            // this.dataSource = deleteItem(this.dataSource, x => x.id == account.id);
            this.updateUI();
          }
        });
      }
    });
  }

  openModalAddExcel():void{
    openDialogConfig<UploadAccountComponent, CreateAccountModel, CreateAccountModel>(this.dialog, UploadAccountComponent, {
      width:"700px"
    })
      .then((createAccount) => {
        if (createAccount){
          // this.service.CreateAccount(createAccount).then(account => {
          //   if (account == null){
          //     return;
          //   }
          //
          //   this.dataSource = addItem(this.dataSource, account);
          //   this.updateUI();
          // })
        }
      });
  }

  updateUI(): void{
    this.ref.detectChanges();
  }
}
