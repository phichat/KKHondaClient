import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { ICarRegisItemRes } from 'app/interfaces/ris';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable({ providedIn: 'root' })
export class CarRegisItemService {
  constructor(private httpClient: HttpClient) { }

  api = `${appConfig.apiUrl}/Ris/ConItem`;

  GetByConNo(conNo: string) {
    const url = `${this.api}/GetByConNo`;
    const params = { conNo }
    return this.httpClient.get<ICarRegisItemRes>(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }
}