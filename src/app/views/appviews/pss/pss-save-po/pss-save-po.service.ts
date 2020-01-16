import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from 'app/core/http.service';
import { appConfig } from 'app/app.config';
import { PurchaseList, PurchaseHead, PurchaseDetail, AutoCompleteModel, ItemDetail } from './pss-save-po.interface';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class PssSavePoService {
  constructor(
    private httpClient: HttpClient,
    private httpService: HttpService,
  ) { }

  //   api = `${appConfig.apiUrl}/mcs/CarHistory`;
  api = `${appConfig.apiUrl}/pss`;

  purchase_list() {
    const url = `${this.api}/purchase_list`
    return this.httpClient.get<PurchaseList[]>(url);
  }

  purchase_detail(po_no: string) {
    const url = `${this.api}/purchase_detail`;
    const params = { po_no };
    return this.httpClient.get<PurchaseHead>(url, { params });
  }

  
  create_purchase(form) {
    const url = `${this.api}/create_purchase`;
    return this.httpClient.post(url, form);

  }

  
  GetBranchAutoComplete(): Observable<AutoCompleteModel[]> {
    const url = `Booking/GetBranchAutoComplete`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }
  get_dealer(): Observable<AutoCompleteModel[]> {
    const url = `pss/get_dealer`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }
  GetUserAutoComplete(): Observable<AutoCompleteModel[]> {
    const url = `Booking/GetSellNameAutoComplete`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }
  get_autocomplete(code_type: string): Observable<AutoCompleteModel[]> {
    const url = `pss/get_autocomplete`;
    const params = { code_type };
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }
  
  GetItemKeyword(key: string) {
    const params = { key };
    const url = `${this.api}/GetItemKeyword`;
    return this.httpClient.get<ItemDetail[]>(url, { params });
  }

}