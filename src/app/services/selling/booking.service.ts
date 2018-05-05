import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { Booking } from '../../models/selling';

@Injectable()
export class BookingService {

  constructor(private http: HttpClient) { }

  getById(bookingId: string) {
    const apiURL = `${appConfig.apiUrl}/Selling/Booking/GetById`;
    const params = { bookingId }
    return this.http.get<Booking[]>(apiURL, { params });
  }

}
