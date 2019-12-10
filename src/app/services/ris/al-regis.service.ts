import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { IAlRes } from 'app/interfaces/ris';

@Injectable({ providedIn: 'root' })
export class AlRegisService {
  constructor(private httpClient: HttpClient) { }

  api = `${appConfig.apiUrl}/Ris/Al`;

  SearchAlList(form: any) {
    const params = { ...form };
    return this.httpClient.get(`${this.api}/SearchAlList`, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  NormalList() {
    const url = `${this.api}/NormalList`;
    return this.httpClient.get(url)
      .pipe(
        catchError(this.onCatch)
      );
  }

  GetByAlNo(alNo: string) {
    const url = `${this.api}/GetByAlNo`;
    const params = { alNo };
    return this.httpClient.get(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  GetBySedNo(sedNo: string) {
    const url = `${this.api}/GetBySedNo`;
    const params = { sedNo };
    return this.httpClient.get<IAlRes[]>(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  Cancel(form: any) {
    const url = `${this.api}/Cancel`;
    return this.httpClient.post(url, form)
      .pipe(
        catchError(this.onCatch)
      );
  }

  Post(form: any) {
    return this.httpClient.post(this.api, form)
      .pipe(
        catchError(this.onCatch)
      );
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }
}