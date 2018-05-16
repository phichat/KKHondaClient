import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { BookingModel, BookingListModel } from '../../models/selling';

@Injectable()
export class BookingService {

  private api = `${appConfig.apiUrl}/Selling/Booking`;

  constructor(private http: HttpClient) { }

  get() {
    return this.http.get<BookingListModel[]>(this.api);
  }

  getById(bookingId: string) {
    const apiURL = `${this.api}/GetById`;
    const params = { bookingId }
    return this.http.get<BookingModel[]>(apiURL, { params });
  }

}
