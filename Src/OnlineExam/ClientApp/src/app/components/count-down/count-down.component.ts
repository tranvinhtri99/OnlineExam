import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subscription, timer} from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countdown',
  template: `<span class="h3" >{{seconds | formatTime}}</span>`
})
export class CountDownComponent implements OnInit, OnDestroy {


  countDown?:Subscription|null;
  @Input() countdown:number = 0;
  public seconds: number = 0;
  @Output() callback = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    this.seconds = this.countdown;

    this.countDown = timer(0, 1000)
      .subscribe(() =>{
        if(this.seconds > 0){
          --this.seconds;
        }else if (this.seconds == 0){
          this.callback.emit();
          this.countDown?.unsubscribe();
          this.countDown = null;
        }
      })
  }

  ngOnDestroy(): void {
    if (this.countDown)
      this.countDown.unsubscribe();
  }



}


export class App {


  constructor() {

  }
}
