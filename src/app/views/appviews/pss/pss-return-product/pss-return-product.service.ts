import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from 'app/core/http.service';
import { appConfig } from 'app/app.config';
import { ReturnList, AutoCompleteModel, ReceiveList, ReturnAvailable, ReturnHead } from './pss-return-product.interface';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class PssReturnProductService {
  constructor(
    private httpClient: HttpClient,
    private httpService: HttpService,
  ) { }

  api = `${appConfig.apiUrl}/pss`;
  fileToUpload;

  return_list() {
    const url = `${this.api}/return_list`
    return this.httpClient.get<ReturnList[]>(url);
  }

  return_detail(return_no: string) {
    const url = `${this.api}/return_detail`;
    const params = { return_no };
    return this.httpClient.get<ReturnHead>(url, { params });
  }

  receive_list() {
    const url = `${this.api}/receive_list`
    return this.httpClient.get<ReceiveList[]>(url);
  }
  
  available_return(receive_no: string) {
    const url = `${this.api}/available_return`;
    const params = { receive_no };
    return this.httpClient.get<ReturnAvailable[]>(url, { params });
  }

  create_return(form) {
    const url = `${this.api}/create_return`;
    return this.httpClient.post(url, form);

  }

  get_dealer(): Observable<AutoCompleteModel[]> {
    const url = `pss/get_dealer`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }

  get_autocomplete(code_type: string): Observable<AutoCompleteModel[]> {
    const url = `pss/get_autocomplete`;
    const params = { code_type };
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }

  GetUserAutoComplete(): Observable<AutoCompleteModel[]> {
    const url = `Booking/GetSellNameAutoComplete`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }

}