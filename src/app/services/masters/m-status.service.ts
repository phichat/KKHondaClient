import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { DropDownModel } from 'app/models/drop-down-model';

@Injectable({providedIn: 'root'})
export class MStatusService {
  constructor(private httpClient: HttpClient) { }
  api = `${appConfig.apiUrl}/Master/MStatus`;

  HPSDropdown() {
    const url = `${this.api}/HPSDropdown`;
    return this.httpClient.get<DropDownModel[]>(url);
  }
}