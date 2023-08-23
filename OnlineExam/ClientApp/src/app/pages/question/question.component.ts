import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Question, TypeQuestion} from "../../models/question-models/question";
import {QuestionService} from "../../services/question.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateQuestionComponent} from "./create-question/create-question.component";
import {confirmDialog, openDialogConfig} from "../../common/functionStatic/open-dialog";
import {UpdateQuestionComponent} from "./update-question/update-question.component";
import {CreateQuestionModel} from "../../models/question-models/create-question-model";
import {addItem, deleteItem, updateItem} from "../../common/functionStatic/update-data";
import {UploadQuestionComponent} from "./upload-question/upload-question.component";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
})
export class QuestionComponent implements OnInit {

  public dataSource: Question[] = [];
  public displayedColumns: string[] = ['id', 'text', 'level', 'correct', 'noise', 'action'];
  public searchQuestion: string | null = null;

  constructor(
    private service: QuestionService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.service.GetAll().then(questions => {
      if (questions == null) {
        this.dataSource = []
      } else {
        this.dataSource = questions;
      }
    })
  }

  handleSearchQuestion(): void {
    this.service.GetAll(this.searchQuestion).then(questions => {
      if (questions == null) {
        this.dataSource = []
      } else {
        this.dataSource = questions;
      }
    })
  }

  openModalCreate(): void {
    openDialogConfig<CreateQuestionComponent, CreateQuestionModel, CreateQuestionModel>(this.dialog, CreateQuestionComponent, {
      width: "700px",
      disableClose: true
    })
      .then((createQuestion) => {
        if (createQuestion) {
          this.service.CreateQuestion(createQuestion).then(question => {
            if (question == null) {
              return;
            }

            this.dataSource = addItem(this.dataSource, question);
            this.updateUI();
          })
        }
      });
  }

  openModalUpdate(question: Question) {
    openDialogConfig<UpdateQuestionComponent, Question, Question>(this.dialog, UpdateQuestionComponent, {
      width: "700px",
      data: question,
      disableClose: true
    }).then((updateQuestion) => {
      if (updateQuestion) {
        this.service.UpdateQuestion(updateQuestion).then(question => {
          if (question == null) {
            return;
          }
          this.dataSource = updateItem(this.dataSource, question, x => x.id)
          this.updateUI();
        })
      }
    });
  }

  confirmDelete(question: Question): void {
    confirmDialog(this.dialog, {
      title: "Confirm delete ?",
      message: `Are you sure you want to delete ${question.text}? This operation is irreversible`,
      callback: () => {
        this.service.DeleteQuestion(question.id ?? 0).then(success => {
          if (success) {
            this.dataSource = deleteItem(this.dataSource, x => x.id == question.id);
            this.updateUI();
          }
        });
      }
    })
  }

  openModalAddExcel(): void {
    openDialogConfig<UploadQuestionComponent, true, true>(this.dialog, UploadQuestionComponent, {
      width: "700px"
    })
      .then((createQuestion) => {
        if (createQuestion) {
          this.service.GetAll().then(questions => {
            if (questions == null) {
              this.dataSource = []
            } else {
              this.dataSource = questions;
            }
          });
        }
      });
  }

  updateUI(): void {
    this.ref.detectChanges();
  }

  downloadTemplateExcel(){
    window.open("assets/add question (template).xlsx")
  }
}
