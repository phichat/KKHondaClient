import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { appConfig } from 'app/app.config';
import { IConItem } from 'app/interfaces/ris';

@Injectable({ providedIn: 'root' })
export class CarListItemService {
  constructor(private httpClient: HttpClient) { }

  api = `${appConfig.apiUrl}/Ris/CarListItem`;

  GetByBookingId(bookingId: string) {
    const url = `${this.api}/GetByBookingId`;
    const params = { bookingId };
    return this.httpClient.get<IConItem[]>(url, { params })
      .pipe(
        catchError(this.onCatch)
      );
  }
  
  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }
}