import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { IClDeposit, IClDepositCancel, IClDepositRes, IClDepositDetail } from 'app/interfaces/ris';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReceiveDepositService {
  constructor(private httpClient: HttpClient) { }

  api = `${appConfig.apiUrl}/Ris/ClDeposit`;

  SearchClDepositList(form: any) {
    const url = `${this.api}/SearchClDepositList`;
    const params = { ...form };
    return this.httpClient.get<IClDepositRes[]>(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  GetDetailById(id: string) {
    const url = `${this.api}/GetDetailById`;
    const params = { id };
    return this.httpClient.get<IClDepositDetail>(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  Create(form: IClDeposit) {
    return this.httpClient.post(this.api, form)
      .pipe(
        catchError(this.onCatch)
      );
  }

  Cancel(form: IClDepositCancel) {
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