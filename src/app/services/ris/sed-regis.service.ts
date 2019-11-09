import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { appConfig } from 'app/app.config';
import { ISedRes } from 'app/interfaces/ris';

@Injectable({ providedIn: 'root' })
export class SedRegisService {
  constructor(private httpClient: HttpClient) { }
  apiURL = `${appConfig.apiUrl}/Ris/Sed`;

  NormalList() {
    const url = `${this.apiURL}/NormalList`;
    return this.httpClient.get(url)
      .pipe(
        catchError(this.onCatch)
      );
  }

  SearchSedList(form: any) {
    const url = `${this.apiURL}/SearchSedList`;
    const params = { ...form };
    return this.httpClient.get(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  GetBySedNo(sedNo: string) {
    const url = `${this.apiURL}/GetBySedNo`;
    const params = { sedNo };
    return this.httpClient.get(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  GetByTermSedNo(term: string) {
    const url = `${this.apiURL}/GetByTermSedNo`
    return this.httpClient.get<ISedRes[]>(url, { params: { term } })
      .pipe(
        catchError(this.onCatch)
      );
  }

  Post(form: any) {
    return this.httpClient.post(this.apiURL, form)
      .pipe(
        catchError(this.onCatch)
      );
  }

  Cancel(form: any) {
    const url = `${this.apiURL}/Cancel`;
    return this.httpClient.post(url, form)
      .pipe(
        catchError(this.onCatch)
      );
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }
}