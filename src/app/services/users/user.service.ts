import { Injectable } from '@angular/core';
import { ModelUser } from '../../models/users';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService {
  private dataSource = new BehaviorSubject<ModelUser>(
    {
      userId: 9,
      userFullName: 'Admin 001',
      branchId: 1
    }
  );
  currentData = this.dataSource.asObservable();

  constructor() { }

  changeData(data: ModelUser) {
    this.dataSource.next(data);
  }

}
