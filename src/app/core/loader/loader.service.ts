import { Injectable } from '@angular/core';
import { LoaderState } from './loader-state';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new Subject<LoaderState>();
  // private loaderSubject = new BehaviorSubject<Boolean>(false);

  loaderState = this.loaderSubject.asObservable();

  constructor() { }

  show() {
    // this.loaderSubject.next(true);
      this.loaderSubject.next(<LoaderState>{show: true});
  }

  hide() {
    // this.loaderSubject.next(false);
      this.loaderSubject.next(<LoaderState>{show: false});
  }
}
