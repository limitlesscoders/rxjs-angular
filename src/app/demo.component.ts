import { Component, Input, OnInit } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  timer,
  of,
  pipe,
  combineLatest
} from "rxjs";
import { map, filter } from "rxjs/operators";
@Component({
  selector: "demo",
  template: `
    <h1>RxJs in Angular</h1>
    <div>
      <h4>RxJs Basics</h4>
      <button mat-raised-button (click)="createObservable()">
        Observables
      </button>

      <button mat-raised-button (click)="createSubject()">
        Subject
      </button>

      <button mat-raised-button (click)="createReplaySubject()">
        Replay Subject
      </button>

      <button mat-raised-button (click)="createBehaviorSubject()">
        Behavior Subject
      </button>

      <h4>RxJs Operators</h4>

      <button mat-raised-button (click)="showcaseCombineLatest()">
        combineLatest
      </button>
      <button mat-raised-button>pipe, filter and map</button>
      <button mat-raised-button>switchMap</button>
      <button mat-raised-button>flatMap</button>
    </div>
  `,
  styles: [
    `
      h1 {
        font-family: Lato;
      }
      button {
        margin: 15px;
      }
    `
  ]
})
export class DemoComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // Difference between an observable and a subject
    // Observable -
    // Observable in simple word is a stram of data [1, 2, 3,...]
    // They are cold/lazy meaning they won't emit values until they are subscribed to
    // Observables is for the consumers, it can be transformed and subscribed
  }

  createObservable() {
    let observable = Observable.create(observer => {
      observer.next("Message 1");
      observer.next("2");
      observer.next("3");
    });

    //observable.next("444");
    observable.subscribe(value => {
      console.log("Observer data", value);
    });
  }

  createSubject() {
    let subject = new Subject();
    subject.next("Missed Message");
    subject.subscribe(value => {
      console.log("Subject data", value);
    });
    subject.next("2");
    subject.unsubscribe();
  }

  createReplaySubject() {
    let replaySubject = new ReplaySubject();
    replaySubject.next("This time I caught you! -- 1");
    replaySubject.next("This time I caught you! -- 2");
    replaySubject.subscribe(value => {
      console.log("Replay Subject data", value);
    });
    replaySubject.next("New message!");
    replaySubject.unsubscribe();
  }

  createBehaviorSubject() {
    let behaviorSubject = new BehaviorSubject("Initial message");

    behaviorSubject.subscribe(value => {
      console.log("Behavior Subject data", value);
    });
    behaviorSubject.next("Message 1");
    behaviorSubject.unsubscribe();
  }

  showcaseCombineLatest() {
    // async data stream
    // Emit data immediately and then every time after 1 seconds
    const dataStream1$ = timer(0, 1000);

    // Emit data immediately and then every time after 2 seconds
    const dataStream2$ = timer(0, 2000);

    // Emit data immediately 3 second and then every time after 3 seconds
    const dataStream3$ = timer(0, 3000);
    // when one timer emits, emit the latest values from each timer as an array
    const subscription = combineLatest(
      dataStream1$,
      dataStream2$,
      dataStream3$
    ).subscribe(([timerValOne, timerValTwo, timerValThree]) => {
      console.log(
        `Timer One Latest: ${timerValOne},
        Timer Two Latest: ${timerValTwo},
        Timer Three Latest: ${timerValThree}`
      );
    });

    setTimeout(() => {
      subscription.unsubscribe();
    }, 5000);
  }

  showcasePipeAndFilter() {
    const fancyCars = of([
      {
        brand: "porsche",
        model: "911"
      },
      {
        brand: "porsche",
        model: "macan"
      },
      {
        brand: "ferarri",
        model: "458"
      },
      {
        brand: "lamborghini",
        model: "urus"
      }
    ]);

    // get data as brand+model string. Result:
    // ["porsche 911", "porsche macan", "ferarri 458", "lamborghini urus"]
    fancyCars
      .pipe(map(cars => cars.map(car => `${car.brand} ${car.model}`)))
      .subscribe(cars => console.log(cars));
  }
}
