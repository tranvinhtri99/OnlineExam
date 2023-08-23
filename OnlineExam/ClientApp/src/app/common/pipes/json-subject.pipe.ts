import { Pipe, PipeTransform } from '@angular/core';
import {Subject} from "../../models/subject-models/subject";

@Pipe({
  name: 'jsonSubject'
})
export class JsonSubjectPipe implements PipeTransform {

  transform(subject: Subject, isFull: boolean = true): string {
    if (isFull) {
      return `${subject.name} (${subject.code} - ${subject.noCredit})`;
    }

    return subject.name ?? (subject.id?.toString() ?? "No name");
  }
}
