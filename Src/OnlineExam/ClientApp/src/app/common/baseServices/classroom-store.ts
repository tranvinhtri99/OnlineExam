import {Injectable} from "@angular/core";
import {Store} from "./store";
import {Classroom} from "../../models/classroom-models/classroom";

@Injectable()
export class ClassroomStore extends Store<Classroom[] | undefined>{

  public constructor () {
    super(undefined);
  }

  public setClassroom(subjects:Classroom[]):void {
    this.setState(subjects);
  }

}
