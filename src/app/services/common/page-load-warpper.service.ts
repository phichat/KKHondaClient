import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PageLoadWarpperService {

  private dataSource = new BehaviorSubject<boolean>(true);
  currentData = this.dataSource.asObservable();

  constructor() { }

  changeData(data: boolean) {
    this.dataSource.next(data)
  }
}
