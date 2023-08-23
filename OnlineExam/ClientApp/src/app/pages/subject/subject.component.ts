import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Subject} from "../../models/subject-models/subject";
import {SubjectService} from "../../services/subject.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateSubjectComponent} from "./create-subject/create-subject.component";
import {confirmDialog, openDialog} from "../../common/functionStatic/open-dialog";
import {UpdateSubjectComponent} from "./update-subject/update-subject.component";
import {CreateSubjectModel} from "../../models/subject-models/create-subject-model";
import {addItem, deleteItem, updateItem} from "../../common/functionStatic/update-data";
import {SubjectStore} from "../../common/baseServices/subject-store";

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
})
export class SubjectComponent implements OnInit {

  public dataSource: Subject[] = [];
  public displayedColumns: string[] = ['id', 'code', 'name', 'noCredit', 'action'];

  constructor(
    private service:SubjectService,
    private dialog:MatDialog,
    private ref: ChangeDetectorRef,
    private store:SubjectStore
  ) { }

  ngOnInit(): void {
    this.service.GetAll().then(subjects => {
      if (subjects == null){
      }else{
        this.dataSource = subjects;
        this.store.setSubject(subjects);
      }
    })
  }

  openModalCreate():void{
    openDialog<CreateSubjectComponent, CreateSubjectModel, CreateSubjectModel>(this.dialog, CreateSubjectComponent)
      .then((createSubject) => {
        if (createSubject){
          this.service.CreateSubject(createSubject).then(subject => {
            if (subject == null){
              return;
            }

            this.dataSource = addItem(this.dataSource, subject);
            this.updateUI();
          })
        }
      });
  }

  openModalUpdate(subject:Subject) {
    openDialog<UpdateSubjectComponent, Subject, Subject>(this.dialog, UpdateSubjectComponent, subject).then((updateSubject) => {
      if (updateSubject){
        this.service.UpdateSubject(updateSubject).then(subject => {
          if (subject == null){
            return;
          }
          this.dataSource = updateItem(this.dataSource, subject, x => x.id)
          this.updateUI();
        })
      }
    });
  }

  confirmDeleteSubject(subject:Subject):void {
    confirmDialog(this.dialog, {
      title: "Confirm delete ?",
      message: `Are you sure you want to delete ${subject.code} (${subject.name})? This operation is irreversible`,
      callback: () => {
        this.service.DeleteSubject(subject.id ?? 0).then(success => {
          if (success){
            this.dataSource = deleteItem(this.dataSource, x => x.id == subject.id);
            this.updateUI();
          }
        });
      }
    })
  }

  updateUI(): void{
    this.ref.detectChanges();
  }
}
