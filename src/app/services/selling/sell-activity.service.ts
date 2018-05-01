import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { SellActivity } from '../../models/selling';

@Injectable()
export class SellActivityService {

  constructor(private http: HttpClient) { }

  getAll() {
    const apiURL = `${appConfig.apiUrl}/Selling/SellActivity`;
    return this.http.get<SellActivity[]>(apiURL);
  }


}
