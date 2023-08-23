import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-question',
  templateUrl: './upload-account.component.html',
})
export class UploadAccountComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  dataFromEventEmitter(data:any):void{
    console.log(data)
  }

  downloadTemplateExcel(){
    window.open("assets/add question (template).xlsx")
  }

}
