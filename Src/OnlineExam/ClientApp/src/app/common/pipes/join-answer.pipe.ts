import { Pipe, PipeTransform } from '@angular/core';
import {Answer} from "../../models/question-models/question";

@Pipe({
  name: 'joinAnswer'
})
export class JoinAnswerPipe implements PipeTransform {

  transform(value: Answer[], correct:boolean = true, charSplit:string=" | "): string {
    const filter = value.filter(x => x.correct == correct).map(x => x.answer);
    return filter.join(charSplit);
  }

}
