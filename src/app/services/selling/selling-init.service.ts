import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SellingInitService {

  private dataSourceProducts = new BehaviorSubject<any[]>([]);
  currentDataProducts = this.dataSourceProducts.asObservable();

  constructor() { }

  changeDataProducts(data: any[]) {
    this.dataSourceProducts.next(data);
  }

}
