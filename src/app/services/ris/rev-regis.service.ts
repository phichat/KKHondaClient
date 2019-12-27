import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appConfig } from 'app/app.config';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RevRegisService {
  constructor(private httpClient: HttpClient) { }

  api = `${appConfig.apiUrl}/Ris/Rev`;

  SearchRevList(form: any) {
    const url = `${this.api}/SearchRevList`;
    const params = { ...form };
    return this.httpClient.get(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  GetByRevNo(revNo: string) {
    const url = `${this.api}/GetByRevNo`;
    const params = { revNo };
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