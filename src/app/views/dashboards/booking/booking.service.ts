import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../../app.config';

@Injectable()
export class BookingService {

  constructor(private http: HttpClient) { }

  private url = `${appConfig.apiUrl}/Dashboards/BookingTotal`;

  GetByCon(startDate: string, endDate: string) {
    const params = {startDate, endDate};
    const apiUrl = `${this.url}/GetByCon`;
    return this.http.get<any>(apiUrl, { params });
  }

}
