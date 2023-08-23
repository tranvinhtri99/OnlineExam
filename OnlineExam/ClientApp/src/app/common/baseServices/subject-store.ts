import {Injectable} from "@angular/core";
import {Store} from "./store";
import {Subject} from "../../models/subject-models/subject";

@Injectable()
export class SubjectStore extends Store<Subject[] | undefined>{

  public constructor () {
    super(undefined);
  }

  public setSubject(subjects:Subject[]):void {
    this.setState(subjects);
  }

}
