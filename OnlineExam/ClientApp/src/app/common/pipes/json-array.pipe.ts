import { Pipe, PipeTransform } from '@angular/core';
import {PropertyPath} from "../functionStatic/update-data";

@Pipe({
  name: 'jsonArray'
})
export class JsonArrayPipe implements PipeTransform {

  transform<T extends object>(values: T[], path: PropertyPath<T>, splitChar:string = " | "): string {

    return values.map(x => path(x)).join(splitChar)
  }

}

