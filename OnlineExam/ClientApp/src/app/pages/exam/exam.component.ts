import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Exam} from "../../models/exam-models/exam";
import {ExamService} from "../../services/exam.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateExamComponent} from "./create-exam/create-exam.component";
import {confirmDialog, openDialog, openDialogConfig} from "../../common/functionStatic/open-dialog";
import {UpdateExamComponent} from "./update-exam/update-exam.component";
import {CreateExamModel} from "../../models/exam-models/create-exam-model";
import {addItem, deleteItem, PropertyPath, updateItem} from "../../common/functionStatic/update-data";
import {Classroom} from "../../models/classroom-models/classroom";
import {TypeQuestion} from "../../models/question-models/question";
import {Router} from "@angular/router";

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
})
export class ExamComponent implements OnInit {

  public dataSource: Exam[] = [];
  public displayedColumns: string[] = ['id', 'name','start','time','subject','countQuestion', 'countStudent', 'countScore', 'action'];

  public pathNameClassroom:PropertyPath<Classroom> = x => x.name;

  constructor(
    private service:ExamService,
    private dialog:MatDialog,
    private ref: ChangeDetectorRef,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.service.GetAll().then(exams => {
      if (exams == null){
        this.dataSource = []
      }else{
        this.dataSource = exams;
      }
    })
  }

  openModalCreate():void{
    openDialogConfig<CreateExamComponent, CreateExamModel, CreateExamModel>(this.dialog, CreateExamComponent, {
      width:"550px"
    })
      .then((createExam) => {
        if (createExam){
          this.service.CreateExam(createExam).then(exam => {
            if (exam == null){
              return;
            }

            this.dataSource = addItem(this.dataSource, exam);
            this.updateUI();
          })
        }
      });
  }

  detailExam(exam:Exam):void {
    this.router.navigate(["exam/" + exam.id]);
  }

  // openModalUpdate(exam:Exam) {
  //   openDialogConfig<UpdateExamComponent, Exam, Exam>(this.dialog, UpdateExamComponent, {
  //     data: exam,
  //     width: "550px"
  //   }).then((updateExam) => {
  //     if (updateExam){
  //       this.service.UpdateExam(updateExam).then(exam => {
  //         if (exam == null){
  //           return;
  //         }
  //         this.dataSource = updateItem(this.dataSource, exam, x => x.id)
  //         this.updateUI();
  //       })
  //     }
  //   });
  // }

  confirmDelete(exam:Exam):void {
    confirmDialog(this.dialog, {
      title: "Confirm delete ?",
      message: `Are you sure you want to delete ${exam.name}? This operation is irreversible`,
      callback: () => {
        this.service.DeleteExam(exam.id ?? 0).then(success => {
          if (success){
            this.dataSource = deleteItem(this.dataSource, x => x.id == exam.id);
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
