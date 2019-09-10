import { Injectable, isDevMode } from '@angular/core';
import { ModelUser } from '../../models/users';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { getCookie, appConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  private user = ['admin_name', 'branch', 'id', 'name', 'user_type'];

  private __user = [
    { name: 'admin_name', value: 'Admin+001' },
    { name: 'branch', value: '1' },
    { name: 'id', value: '4111' },
    { name: 'menu', value: 'open' },
    { name: 'name', value: '001' },
    { name: 'user_type', value: '2' }
  ];


  private url = `${appConfig.apiUrl}/Users`;


  currentData = new BehaviorSubject<ModelUser>(null);
  // currentData = this.dataSource.asObservable();

  constructor(private http: HttpClient) {

    // if (isDevMode()) {
      this.__user.map(async x => {
        await this.setCookie(x.name, x.value);
      })
    // }

    if (getCookie('id')) {
      const id = getCookie('id');
      this.getUserById(id).then(x => {
        if (x == null) {
          this.signOut();
          return;
        }
        this.changeData(x)
      });
    }
  }

  changeData(data: ModelUser) {
    this.currentData.next(data);
  }

  signOut() {
    this.user.map(async x => await this.deleteCookie(x));
    window.location.href = 'http://203.154.126.61/KK-Honda-Web/backoffice/login.php';
  }

  private deleteCookie(cname) {
    var d = new Date(); //Create an date object
    d.setTime(d.getTime() - (1000 * 60 * 60 * 24)); //Set the time to the past. 1000 milliseonds = 1 second
    var expires = "expires=" + d.toUTCString(); //Compose the expirartion date
    window.document.cookie = cname + "=" + "; " + expires;//Set the cookie with name and the expiration date

  }

  private setCookie(cname, cvalue) {
    let d = new Date();
    d.setTime(d.getTime() + 60 * 60 * 24 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  async  getUserById(id: string): Promise<ModelUser> {
    const apiURL = `${this.url}/GetUserById`;
    const params = { id };

    return await this.http.get<ModelUser>(apiURL, { params }).toPromise();
  }

}  
