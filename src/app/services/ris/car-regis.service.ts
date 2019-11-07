import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { ICarRegisRes, ICarRegisClDeposit, IConRes, ICarRegisWaitingTagRes } from 'app/interfaces/ris';

@Injectable({ providedIn: 'root' })
export class CarRegisService {
  constructor(private httpClient: HttpClient) { }

  api = `${appConfig.apiUrl}/Ris`;

  GetByConNo(conNo: string) {
    const params = { conNo }
    const url = `${this.api}/GetByConNo`;
    return this.httpClient.get<ICarRegisRes>(url, { params });
  }


  CarRegisReceiveTag() {
    const url = `${this.api}/CarRegisReceiveTag`;
    return this.httpClient.get<ICarRegisRes[]>(url);
  }

  CarRegisReceiveWaranty() {
    const url = `${this.api}/CarRegisReceiveWaranty`;
    return this.httpClient.get<ICarRegisClDeposit[]>(url);
  }

  CarRegisReceiveAct() {
    const url = `${this.api}/CarRegisReceiveAct`;
    return this.httpClient.get<ICarRegisClDeposit[]>(url);
  }

  GetByConNoListReceiveTag(conListNo: string[]) {
    const params = { conListNo };
    const url = `${this.api}/GetByConNoListReceiveTag`;
    return this.httpClient.get<IConRes[]>(url, { params });
  }

  SearchRegisList(form: any) {
    const params = { ...form };
    const url = `${this.api}/SearchRegisList`;
    return this.httpClient.get<ICarRegisRes[]>(url, { params });
  }

  SearchWaitingTag(form: any) {
    const params = { ...form };
    const url = `${this.api}/SearchWaitingTag`;
    return this.httpClient.get<ICarRegisWaitingTagRes[]>(url, { params });
  }
  
}