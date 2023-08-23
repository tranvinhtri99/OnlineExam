import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
  ) { }

  ngOnInit(): void {

  }

  onConfirm(): void {

    this.dialogRef.close();
    if (this.data.callback){
      this.data.callback();
    }
  }

}

export class ConfirmDialogModel {

  constructor(public title: string, public message: string, public callback?:Function) {
  }
}
