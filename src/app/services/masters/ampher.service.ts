// export class AmpherService {

// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { IMAmpher } from 'app/interfaces/masters';

@Injectable({ providedIn: 'root' })
export class AmpherService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = `${appConfig.apiUrl}/Master/MAmpher`


  GetAmpherByProvinceCode(provinceCode: string) {
    const url = `${this.apiUrl}/GetAmpherByProvinceCode`;
    const params = { provinceCode };
    return this.httpClient.get<IMAmpher[]>(url, { params });
  }

  GetAmpherByCode(ampherCode: string) {
    const url = `${this.apiUrl}/GetAmpherByCode`;
    const params = { ampherCode };
    return this.httpClient.get<IMAmpher>(url, { params });
  }

}