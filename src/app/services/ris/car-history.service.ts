import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { ICarHistoryRes } from 'app/interfaces/ris';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CarHistoryService {
  constructor(
    private http: HttpClient
  ) { }

  api = `${appConfig.apiUrl}/Ris/CarHistory`;

  SearchByEngine(term: string) {
    const params = { term };
    return this.http.get<any>(`${this.api}/SearchByEngine`, { params })
    .pipe(
      catchError(this.onCatch)
    );
  }

  GetByBookingId(bookingId: string) {
    const params = {bookingId};
    return this.http.get<ICarHistoryRes>(`${this.api}/GetByBookingId`, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }
}