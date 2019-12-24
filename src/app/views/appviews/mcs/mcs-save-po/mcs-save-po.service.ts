import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { savePO_H } from './mcs-save-po.interface';


@Injectable()
export class McsSavePoService {
    constructor(private httpClient: HttpClient) { }

//   api = `${appConfig.apiUrl}/mcs/CarHistory`;
  api = `${appConfig.apiUrl}/mcs`;

  GetAll() {
    const url = `${this.api}/all`
    return this.httpClient.get<savePO_H[]>(url);
  }

  GetDetail(po_no: string) {
    const url = `${this.api}/GetDetail`;
    const params = { po_no };
    return this.httpClient.get<savePO_H>(url, { params });
  }

}