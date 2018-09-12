import { Injectable } from '@angular/core';
import { ModelUser } from '../../models/users';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService {
  private user = [
    { name: 'admin_name', value: 'Admin+001' },
    { name: 'branch', value: '1' },
    { name: 'id', value: '9' },
    { name: 'menu', value: 'open' },
    { name: 'name', value: '001' },
    { name: 'user_type', value: '2' }
  ];

  private dataSource = new BehaviorSubject<ModelUser>(
    {
      adminName: 'Admin 001',
      branch: 1,
      id: 9,
      menu: 'open',
      name: '001',
      userType: 2
    }
  );
  currentData = this.dataSource.asObservable();

  constructor() {
    const expires = new Date();
    this.user.map(item => {
      this.setCookie(item.name, item.value);
    });
  }

  changeData(data: ModelUser) {
    this.dataSource.next(data);
  }

  private setCookie(cname, cvalue) {
    let d = new Date();
    d.setTime(d.getTime() + 60 * 60 * 24 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

}  
