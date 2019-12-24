import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { DropDownModel } from 'app/models/drop-down-model';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

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

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }


}