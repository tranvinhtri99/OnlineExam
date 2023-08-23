import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Classroom} from "../../models/classroom-models/classroom";
import {ClassroomService} from "../../services/classroom.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateClassroomComponent} from "./create-classroom/create-classroom.component";
import {confirmDialog, openDialog} from "../../common/functionStatic/open-dialog";
import {UpdateClassroomComponent} from "./update-classroom/update-classroom.component";
import {CreateClassroomModel} from "../../models/classroom-models/create-classroom-model";
import {addItem, deleteItem, updateItem} from "../../common/functionStatic/update-data";
import {ClassroomStore} from "../../common/baseServices/classroom-store";

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
})
export class ClassroomComponent implements OnInit {

  public dataSource: Classroom[] = [];
  public displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    private service:ClassroomService,
    private dialog:MatDialog,
    private ref: ChangeDetectorRef,
    private store:ClassroomStore
  ) { }

  ngOnInit(): void {
    this.service.GetAll().then(classrooms => {
      if (classrooms == null){
        this.dataSource = []
      }else{
        this.dataSource = classrooms;
        this.store.setClassroom(classrooms);
      }
    })
  }

  openModalCreate():void{
    openDialog<CreateClassroomComponent, CreateClassroomModel, CreateClassroomModel>(this.dialog, CreateClassroomComponent)
      .then((createClassroom) => {
        if (createClassroom){
          this.service.CreateClassroom(createClassroom).then(classroom => {
            if (classroom == null){
              return;
            }

            this.dataSource = addItem(this.dataSource, classroom);
            this.updateUI();
          })
        }
      });
  }

  openModalUpdate(classroom:Classroom) {
    openDialog<UpdateClassroomComponent, Classroom, Classroom>(this.dialog, UpdateClassroomComponent, classroom).then((updateClassroom) => {
      if (updateClassroom){
        this.service.UpdateClassroom(updateClassroom).then(classroom => {
          if (classroom == null){
            return;
          }
          this.dataSource = updateItem(this.dataSource, classroom, x => x.id)
          this.updateUI();
        })
      }
    });
  }

  confirmDelete(classroom:Classroom):void {
    confirmDialog(this.dialog, {
      title: "Confirm delete ?",
      message: `Are you sure you want to delete ${classroom.name}? This operation is irreversible`,
      callback: () => {
        this.service.DeleteClassroom(classroom.id ?? 0).then(success => {
          if (success){
            this.dataSource = deleteItem(this.dataSource, x => x.id == classroom.id);
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
