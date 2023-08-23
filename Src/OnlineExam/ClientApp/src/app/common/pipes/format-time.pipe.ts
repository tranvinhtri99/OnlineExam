import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(seconds: number): unknown {
    const minutes: number = Math.floor(seconds / 60);
    return (
      ("00" + minutes).slice(-2) +
      ":" +
      ("00" + Math.floor(seconds - minutes * 60)).slice(-2)
    );
  }

}
