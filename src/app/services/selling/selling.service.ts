import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ModelSummary } from '../../models/selling';

@Injectable()
export class SellingService {
  private dataSource = new BehaviorSubject<ModelSummary>(
    {
      bookingCode: 'New',
      status: '',
      totalMotobike: 0,
      totalAccessory: 0,
      totalSell: 0,
      totalDiscount: 0,
      totalVatPrice: 0,
      totalSellNet: 0
    }
  );
  currentData = this.dataSource.asObservable();

  constructor() { }

  changeData(data: ModelSummary) {
    this.dataSource.next(data);
  }

}
