import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { getCookie, appConfig } from '../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUserResCookie } from 'app/interfaces/users';
import { Observable } from 'rxjs';
import { catchError, tap, map, finalize } from 'rxjs/operators';
import { HttpService } from 'app/core/http.service';
import { LoaderService } from 'app/core/loader/loader.service';

@Injectable()
export class UserService {
  private user = [
    'id',
    'adminName',
    'fullName',
    'userType',
    'branchId',
    'branch',
    'branchName',
    'department',
    'gId',
    'name',
    'groupPagePermission'
  ];

  private url = `${appConfig.apiUrl}/Users`;


  currentData = new BehaviorSubject<IUserResCookie>(null);
  // currentData = this.dataSource.asObservable();

  constructor(
    private http: HttpClient,
    private s_http: HttpService,
    private s_loader: LoaderService,
  ) {

    if (isDevMode()) {
      this.getUserById('6119').subscribe(x => {
        for (const key in x) {
          if (x.hasOwnProperty(key)) {
            this.setCookie(key, JSON.stringify(x[key]));
          }
        }
        this.setLocalStore(x);
        this.changeData(x)
      });
    } else {
      if (getCookie('id')) {
        const id = getCookie('id');
        this.getUserById(id).subscribe(x => {
          if (x == null) {
            this.signOut();
            return;
          }
          this.setLocalStore(x);
          this.changeData(x)
        });
      }
    }
  }

  changeData(data: IUserResCookie) {
    this.currentData.next(data);
  }

  get cookies(): IUserResCookie {
    // const _cookie: IUserResCookie = {
    //   id: JSON.parse(getCookie('id')),
    //   adminName: JSON.parse(getCookie('adminName')),
    //   fullName: JSON.parse(getCookie('fullName')),
    //   userType: JSON.parse(getCookie('userType')),
    //   branchId: JSON.parse(getCookie('branchId')),
    //   branch: JSON.parse(getCookie('branch')),
    //   branchName: JSON.parse(getCookie('branchName')),
    //   // department: JSON.parse(getCookie('department')),
    //   // name: JSON.parse(getCookie('name')),
    //   // gId: JSON.parse(getCookie('gId')),
    //   // groupPagePermission: JSON.parse(getCookie('groupPagePermission')),
    // };
    return JSON.parse(localStorage.getItem('user-logged'));
  }

  signOut() {
    this.user.map(x => this.deleteCookie(x));
    localStorage.removeItem('user-logged');
    window.location.href = 'http://203.154.126.61/KK-Honda-Web/backoffice/login.php';
  }

  private deleteCookie(cname) {
    var d = new Date(); //Create an date object
    d.setTime(d.getTime() - (1000 * 60 * 60 * 24)); //Set the time to the past. 1000 milliseonds = 1 second
    var expires = "expires=" + d.toUTCString(); //Compose the expirartion date
    window.document.cookie = cname + "=" + "; " + expires;//Set the cookie with name and the expiration date

  }

  private setLocalStore(item: IUserResCookie) {
    localStorage.setItem('user-logged', JSON.stringify(item));
  }

  private setCookie(cname, cvalue) {
    let d = new Date();
    d.setTime(d.getTime() + 60 * 60 * 24 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  // 
  getUserById(id: string): Observable<IUserResCookie> {
    const apiURL = `${this.url}/GetUserById`;
    const params = { id };

    return this.http.get<IUserResCookie>(apiURL, { headers: this.getHeaders(), params });
  }

  LeaderValidate(gid: string, userName: string, password: string): Observable<number> {
    const apiURL = `${this.url}/LeaderValidate`;
    const params = { gid, userName, password };
    return this.http.get<number>(apiURL, { headers: this.getHeaders(), params });
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.delete('Cookie');
    return headers;
  }

}  
