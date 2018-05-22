import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ContractItemModel } from '../../models/credit';

@Injectable()
export class ContractItemService {
  private model = new ContractItemModel;
  private dataSource = new BehaviorSubject<ContractItemModel>(this.model);
  currentData = this.dataSource.asObservable();

  constructor() { }

  changeMessage(data: ContractItemModel) {
    this.dataSource.next(data)
  }

}
