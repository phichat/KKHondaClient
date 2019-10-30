import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { ICarRegisRes, ICarRegisReceiveDeposit } from 'app/interfaces/ris';

@Injectable({ providedIn: 'root' })
export class CarRegisService {
  constructor(private httpClient: HttpClient) { }

  api = `${appConfig.apiUrl}/Ris`;

  CarRegisReceiveTag() {
    const url = `${this.api}/CarRegisReceiveTag`;
    return this.httpClient.get<ICarRegisRes[]>(url);
  }

  CarRegisReceiveWaranty() {
    const url = `${this.api}/CarRegisReceiveWaranty`;
    return this.httpClient.get<ICarRegisReceiveDeposit[]>(url);
  }

  CarRegisReceiveAct() {
    const url = `${this.api}/CarRegisReceiveAct`;
    return this.httpClient.get<ICarRegisReceiveDeposit[]>(url);
  }
}