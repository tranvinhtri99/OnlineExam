import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Exam, ExamDetail, ExamScore} from "../../models/exam-models/exam";
import {ExamService} from "../../services/exam.service";
import {confirmDialog} from "../../common/functionStatic/open-dialog";
import {addItem, deleteItem} from "../../common/functionStatic/update-data";
import {MatDialog} from "@angular/material/dialog";
import {Classroom} from "../../models/classroom-models/classroom";
import {ClassroomService} from "../../services/classroom.service";
import {tokenAccount} from "../../common/baseServices/login-store";
import {Account, StudentWithScore} from "../../models/account-models/account";

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.component.html',
  styles:[`
    button.col{
      margin: 15px;
    }
  `]
})
export class ExamDetailComponent implements OnInit {

  public idExam:number;
  public exam!:ExamScore;
  public dataSource:StudentWithScore[] = [];
  public classrooms:Classroom[] = [];
  public displayedColumns: string[] = ['id', 'name','username', 'classroom', 'score', 'action'];

  public studentId: string = '';
  public classroomId: number = 0;
  public disableCalcScore:boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private dialog:MatDialog,
    private service:ExamService,
    private ref: ChangeDetectorRef,
    private classroomService: ClassroomService,
  ) {
    this.idExam = parseInt(route.snapshot.paramMap.get("id") ?? "0");
    if (this.idExam <= 0){
      router.navigate([""])
    }
  }

  ngOnInit(): void {
    this.service.GetExamDetail(this.idExam).then(exam => {
      if (exam){
       this.exam = exam;
        this.disableCalcScore = !this.exam.start || this.exam.start < new Date();
       if (exam.studentWithScores){
         this.dataSource = exam.studentWithScores;
       }
      }
    });

    this.classroomService.GetAll().then(classrooms => {if (classrooms) this.classrooms = classrooms});


  }

  confirmDelete(account:Account):void {
    confirmDialog(this.dialog, {
      title: "Confirm delete ?",
      message: `Are you sure you want to delete ${account.name}? This operation is irreversible`,
      callback: () => {
        this.service.DeleteStudent(this.idExam, account.id!.toString()).then(success => {
          if (success){
            this.dataSource = deleteItem(this.dataSource, x => x.id == account.id);
            this.updateUI();
          }
        });
      }
    })
  }

  updateUI(): void{
    this.ref.detectChanges();
  }

  addStudent():void {
    this.service.AddStudent(this.idExam, this.studentId!).then(student => {
      if (student){
        this.exam.studentWithScores = addItem<StudentWithScore>(this.exam.studentWithScores, student);
        this.dataSource = addItem(this.dataSource, student);

        this.studentId = "";
        this.updateUI();
      }
    })
  }

  handleClassroomChanged(){
    if (this.classroomId === 0){
      this.dataSource = this.exam.studentWithScores;
    }else{
      this.dataSource = this.exam.studentWithScores.filter(student => student.classroom?.id == this.classroomId);
    }
  }

  printExamList(){
    if (this.classroomId == 0){
      window.open( this.service.UrlService + "/export/list/" + this.idExam + "?token=" + tokenAccount);
    }else{
      window.open( this.service.UrlService + `/export/list/${this.idExam}/${this.classroomId}?token=${tokenAccount}`);
    }
  }

  printTheExam(){
    if (this.classroomId == 0){
      window.open( this.service.UrlService + "/export/examTest/" + this.idExam + "?token=" + tokenAccount);
    }else{
      window.open( this.service.UrlService + `/export/examTest/${this.idExam}/${this.classroomId}?token=${tokenAccount}`);
    }
  }


  downloadExcel() {
    if (this.classroomId == 0){
      window.open( this.service.UrlService + "/export/listExcel/" + this.idExam + "?token=" + tokenAccount);
    }else{
      window.open( this.service.UrlService + `/export/listExcel/${this.idExam}/${this.classroomId}?token=${tokenAccount}`);
    }
  }
}
