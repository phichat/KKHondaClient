import { Injectable } from '@angular/core';
import { CalculateModel } from '../../models/credit';
import { appConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CalculateService {

   constructor(private http: HttpClient) { }

   Add(calculate: CalculateModel) {
      const apiURL = `${appConfig.apiUrl}/CreditCalculates`;
      return this.http.post(apiURL, calculate);
   }

}
