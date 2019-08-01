import { Injectable } from '@angular/core';
import { LoaderState } from './loader-state';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new Subject<LoaderState>();

  loaderState = this.loaderSubject.asObservable();

  constructor() { }

  show() {
    this.loaderSubject.next(<LoaderState>{ show: true });
  }

  hide() {
    this.loaderSubject.next(<LoaderState>{ show: false });
  }

  public onEnd(): void {
    this.hideLoader();
  }

  public showLoader(): void {
    this.show();
  }

  public hideLoader(): void {
    this.hide();
  }
}
