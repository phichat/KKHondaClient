import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { DropDownModel } from 'app/models/drop-down-model';

@Injectable({ providedIn: 'root' })
export class ReasonService {
  constructor(private httpClient: HttpClient) { }

  url = `${appConfig.apiUrl}/Reason`;

  DropDown() {
    return this.httpClient.get<DropDownModel[]>(`${this.url}/DropDown`);
  }
}