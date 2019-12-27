import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { DropDownModel } from 'app/models/drop-down-model';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { IMProvince } from 'app/interfaces/masters';

@Injectable({ providedIn: 'root' })
export class ProvinceService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = `${appConfig.apiUrl}/Master/MProvince`

  DropDown(): Observable<DropDownModel[]> {
    const url = `${this.apiUrl}/DropDown`;
    return this.httpClient.get<DropDownModel[]>(url)
      .pipe(
        catchError(this.onCatch)
      );
  }

  GetProvinceByCode(provinceCode: string): Observable<IMProvince> {
    const url = `${this.apiUrl}/GetProvinceByCode`;
    const params = { provinceCode };
    return this.httpClient.get<IMProvince>(url, { params });
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }


}