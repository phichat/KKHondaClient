import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { DropDownModel } from 'app/models/drop-down-model';

@Injectable({ providedIn: 'root' })
export class InsuranceService {
  constructor(private httpClient: HttpClient) { }

  api = `${appConfig.apiUrl}/Master`;

  Dropdown() {
    const url = `${this.api}/CompanyInsurance/DropDown`;
    return this.httpClient.get<DropDownModel[]>(url);
  }

}