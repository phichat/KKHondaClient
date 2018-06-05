import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { SellActivityModel } from 'app/models/sell-activity';

@Injectable()
export class SellActivityService {

  constructor(private http: HttpClient) { }

  getAll() {
    const apiURL = `${appConfig.apiUrl}/Selling/SellActivity`;
    return this.http.get<SellActivityModel[]>(apiURL);
  }

  filterByKey(sellTypeId: string) {
    const apiURL = `${appConfig.apiUrl}/Selling/SellActivity/FilterByKey`;
    const params = { sellTypeId }
    return this.http.get<SellActivityModel[]>(apiURL, { params });
  }
}
