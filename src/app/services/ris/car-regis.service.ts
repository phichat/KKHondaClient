import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { ICarRegisRes, ICarRegisClDeposit, IConRes, ICarRegisWaitingTagRes } from 'app/interfaces/ris';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { IBookingCarDetail } from 'app/interfaces/sellings';

@Injectable({ providedIn: 'root' })
export class CarRegisService {
  constructor(private httpClient: HttpClient) { }

  api = `${appConfig.apiUrl}/Ris`;

  GetByConNo(conNo: string) {
    const params = { conNo }
    const url = `${this.api}/GetByConNo`;
    return this.httpClient.get<ICarRegisRes>(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  GetCarBySellNo(sellNo: string): Observable<IBookingCarDetail> {
    const params = { sellNo };
    const url = `${this.api}/GetCarBySellNo`;
    return this.httpClient.get(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  CarRegisReceiveTag() {
    const url = `${this.api}/CarRegisReceiveTag`;
    return this.httpClient.get<ICarRegisRes[]>(url)
      .pipe(
        catchError(this.onCatch)
      );
  }

  CarRegisReceiveWaranty() {
    const url = `${this.api}/CarRegisReceiveWaranty`;
    return this.httpClient.get<ICarRegisClDeposit[]>(url)
      .pipe(
        catchError(this.onCatch)
      );
  }

  CarRegisReceiveAct() {
    const url = `${this.api}/CarRegisReceiveAct`;
    return this.httpClient.get<ICarRegisClDeposit[]>(url)
      .pipe(
        catchError(this.onCatch)
      );
  }

  GetByConNoListReceiveTag(conListNo: string[]) {
    const params = { conListNo };
    const url = `${this.api}/GetByConNoListReceiveTag`;
    return this.httpClient.get<IConRes[]>(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  SearchRegisList(form: any) {
    const params = { ...form };
    const url = `${this.api}/SearchRegisList`;
    return this.httpClient.get<ICarRegisRes[]>(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  SearchWaitingTag(form: any) {
    const params = { ...form };
    const url = `${this.api}/SearchWaitingTag`;
    return this.httpClient.get<ICarRegisWaitingTagRes[]>(url, { params })
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

  Update(form: any) {
    const url = `${this.api}/Update`;
    return this.httpClient.post(url, form)
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