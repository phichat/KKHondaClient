import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { appConfig } from 'app/app.config';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ClRegisService {
  constructor(private httpClient: HttpClient) { }

  api = `${appConfig.apiUrl}/Ris/Cl`;

  SearchClList(form: any) {
    const params = { ...form };
    const url = `${this.api}/SearchClList`;
    return this.httpClient.get(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  GetByClNo(clNo: string) {
    const url = `${this.api}/GetByClNo`;
    const params = { clNo };
    return this.httpClient.get(url, { params })
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

  Cancel(form: any) {
    const url = `${this.api}/Cancel`;
    return this.httpClient.post(url, form)
      .pipe(
        catchError(this.onCatch)
      );
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }
}