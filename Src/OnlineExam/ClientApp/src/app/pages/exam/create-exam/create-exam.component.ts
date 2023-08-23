import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {CreateExamModel} from "../../../models/exam-models/create-exam-model";
import {ExamService} from "../../../services/exam.service";
import {SubjectService} from "../../../services/subject.service";
import {Subject} from "../../../models/subject-models/subject";
import {Classroom} from "../../../models/classroom-models/classroom";
import {ClassroomService} from "../../../services/classroom.service";
import {Dictionary} from "../../../models/account-models/create-account-model";
import {addItemClone, removeItem} from "../../../common/functionStatic/update-data";
import {snackbarError} from "../../../common/functionStatic/show-snackbar";
import {DatePipe} from "@angular/common";
import {QuestionService} from "../../../services/question.service";

@Component({
  selector: 'app-create-question',
  templateUrl: './create-exam.component.html',
  styles: [`
    mat-form-field{
      width: 95%;
    }
    div[mat-dialog-content] > p {
      text-align: center;
      margin: 0 auto;
    }
    .level-question{
      width: 41.666666667% !important;
    }
    p.row > span{
      text-align: start;
    }

  `]
})
export class CreateExamComponent implements OnInit {

  public data : CreateExamModel = new CreateExamModel();

  pipe = new DatePipe('en-US');
  public minDate:Date = new Date();
  public minDateOut = this.pipe.transform(this.minDate, "YYYY-MM-dd HH:mm:ss");

  public subjects:Subject[] = [];
  public classrooms:Classroom[] = [];

  public levelQuestionTemp:Dictionary<number, number> = { key:0, value: 0};
  public allLevelQuestions:Dictionary<number, number>[] = [];
  public maxQuestion:number = 0;
  public levels:number[] = [];


  constructor(
    public dialogRef: MatDialogRef<CreateExamComponent>,
    private service:ExamService,
    private serviceSubject:SubjectService,
    private serviceClassroom:ClassroomService,
    private questionService:QuestionService,
    private ref: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    this.serviceSubject.GetAll().then(subjects => {
      if (subjects)
        this.subjects = subjects;
    })

    this.serviceClassroom.GetAll().then(classrooms => {
      if (classrooms)
        this.classrooms = classrooms;
    })

  }

  submit() {
    if (this.data.start === undefined || this.data.start < this.minDate){
      snackbarError("Start time invalid");
      return
    }

    console.log(this.data);
    this.dialogRef.close(this.data)
  }

  checkTimeStart(time:Date){
    if (time === undefined || time < this.minDate){
      snackbarError("Start time invalid");
      return
    }
  }

  addLevelQuestion():void{
    if (this.levelQuestionTemp.key == 0 || this.levelQuestionTemp.value == 0){
      snackbarError("Please input for level and number question")
      return
    }

    this.data.levelQuestions = addItemClone(this.data.levelQuestions, this.levelQuestionTemp);
    this.levelQuestionTemp.key = 0;
    this.levelQuestionTemp.value = 0;

    this.updateLevel();
    this.updateUI();
  }

  removeLevelQuestion(index:number): void{
    this.data.levelQuestions = removeItem(this.data.levelQuestions, index);
    this.updateLevel();
  }

  updateUI(): void{
    this.ref.detectChanges();
  }

  onSubjectChanged(){

    this.data.levelQuestions = [];
    if (this.data.subjectId){
      this.questionService.GetLevelCountQuestions(this.data.subjectId).then(levelQuestions => {
        if (levelQuestions){
          this.allLevelQuestions = levelQuestions;
          this.updateLevel();
        }
      })
    }else{
      this.allLevelQuestions = [];
      this.updateLevel();
    }

  }

  onLevelQuestionCurrentChanged(){
    this.allLevelQuestions.forEach(v => {
      if (v.key === this.levelQuestionTemp.key){
        this.maxQuestion = v.value;
      }
    })
  }

  updateLevel(): void {
    this.levels = this.allLevelQuestions.filter(levelQuestion =>
       this.data.levelQuestions.find(v => v.key === levelQuestion.key) === undefined
    ).map(levelQuestion => levelQuestion.key);
  }
}
