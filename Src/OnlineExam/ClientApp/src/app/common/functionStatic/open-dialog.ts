import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ComponentType} from "@angular/cdk/portal";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../../components/confirm-dialog/confirm-dialog.component";


export function openDialog<T,D = any,U = any>(dialog:MatDialog, component: ComponentType<T>, data?:D):Promise<U|null>{

  return dialog.open(component, {
    width: "350px",
    data: data,
    disableClose:true
  }).afterClosed().toPromise<U>()
}

export function openDialogConfig<T,D = any,U = any>(dialog:MatDialog, component: ComponentType<T>, config?:MatDialogConfig<D>):Promise<D |U|null>{
  if (!config){
    config = {
      width: "350px",
      disableClose : true
    }
  }

  if (config.disableClose == undefined){
    config.disableClose = true;
  }
  return dialog.open(component, config).afterClosed().toPromise<U>()
}


export function confirmDialog<T>(dialog:MatDialog, confirmModal: ConfirmDialogModel, config?:MatDialogConfig<ConfirmDialogModel>): Promise<void>{
  if (!config){
    config = {
      width: "500px",
      data: confirmModal,
      disableClose: true
    };
  }

  if (config.disableClose == undefined){
    config.disableClose = true;
  }

  return dialog.open(ConfirmDialogComponent, config).afterClosed().toPromise<void>();
}
