import { Injectable } from '@angular/core';
import { appConfig } from '../../app.config';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RptSumCloseContractModel } from '../../models/credit/rpt-sum-close-contract.model';

@Injectable()
export class RptSummayCloseContractService {
  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  constructor(private http: HttpClient) { }

  private url = `${appConfig.apiUrl}/Credit/RptSumCloseContract`;

  OnInit() {
    return this.http.get<any>(this.url);
  }

  GetByCon(_params: any) {
    const params = _params;
    const apiUrl = `${this.url}/GetByCon`;
    return this.http.get<RptSumCloseContractModel[]>(apiUrl, { params });
  }

}
