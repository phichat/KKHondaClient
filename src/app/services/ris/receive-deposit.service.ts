import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { IClDeposit, IClDepositCancel, IClDepositRes, IClDepositDetail } from 'app/interfaces/ris';

@Injectable({ providedIn: 'root' })
export class ReceiveDepositService {
  constructor(private httpClient: HttpClient) { }

  api = `${appConfig.apiUrl}/Ris/ClDeposit`;

  GetAll() {
    const url = `${this.api}/All`
    return this.httpClient.get<IClDepositRes[]>(url);
  }

  GetDetailById(id: string) {
    const url = `${this.api}/GetDetailById`;
    const params = { id };
    return this.httpClient.get<IClDepositDetail>(url, { params });
  }

  Create(form: IClDeposit) {
    return this.httpClient.post(this.api, form)
  }

  Cancel(form: IClDepositCancel) {
    const url = `${this.api}/Cancel`;
    return this.httpClient.post(url, form);
  }
}