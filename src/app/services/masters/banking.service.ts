import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { DropDownModel } from 'app/models/drop-down-model';
import { IBankingDetail } from 'app/interfaces/banking';

@Injectable({ providedIn: 'root' })
export class BankingService {
  constructor(private httpClient: HttpClient) { }

  api = `${appConfig.apiUrl}/Master/Bank`;

  DropDown() {
    const url = `${this.api}/DropDown`;
    return this.httpClient.get<DropDownModel[]>(url);
  }

  GetBookBank() {
    const url = `${this.api}/GetBookBank`;
    return this.httpClient.get<IBankingDetail[]>(url);
  }

}