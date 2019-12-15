import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { DropDownModel } from 'app/models/drop-down-model';

@Injectable({providedIn: 'root'})
export class ZoneService {
  constructor(private httpClient: HttpClient) { }
  api = `${appConfig.apiUrl}/Master/MZone`;

  DropDown() {
    const url = `${this.api}/DropDown`;
    return this.httpClient.get<DropDownModel[]>(url);
  }
}