import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from 'app/core/http.service';
import { appConfig } from 'app/app.config';
import { ReceiveH, ReceiveD, ReceiveDetail, AutoCompleteModel } from './mcs-save-receipt.interface';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class McsSaveReceiptService {
  constructor(
    private httpClient: HttpClient,
    private httpService: HttpService,
  ) { }

  //   api = `${appConfig.apiUrl}/mcs/CarHistory`;
  api = `${appConfig.apiUrl}/mcs`;
  fileToUpload;

  receive_list() {
    const url = `${this.api}/receive_list`
    return this.httpClient.get<ReceiveH[]>(url);
  }

  receive_detail(receive_no: string) {
    const url = `${this.api}/receive_detail`;
    const params = { receive_no };
    return this.httpClient.get<ReceiveDetail>(url, { params });
  }


  get_autocomplete(code_type: string): Observable<AutoCompleteModel[]> {
    const url = `mcs/get_autocomplete`;
    const params = { code_type };
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }

  GetUserAutoComplete(): Observable<AutoCompleteModel[]> {
    const url = `Booking/GetSellNameAutoComplete`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }

  GetBranchAutoComplete(): Observable<AutoCompleteModel[]> {
    const url = `Booking/GetBranchAutoComplete`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }
  GetRegisNameAutoComplete(): Observable<AutoCompleteModel[]> {
    const url = `Booking/GetRegisNameAutoComplete`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }

  get_province(): Observable<AutoCompleteModel[]> {
    const url = `mcs/get_province`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }
  get_cat(): Observable<AutoCompleteModel[]> {
    const url = `mcs/get_cat`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }
  get_dealer(): Observable<AutoCompleteModel[]> {
    const url = `mcs/get_dealer`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }
  
  GetBrandAutoComplete(): Observable<AutoCompleteModel[]> {
    const url = `mcs/get_brand`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }

  GetModelAutoComplete(): Observable<AutoCompleteModel[]> {
    const url = `mcs/get_model`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }

  GetTypeAutoComplete(): Observable<AutoCompleteModel[]> {
    const url = `mcs/get_type`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }

  GetColorAutoComplete(): Observable<AutoCompleteModel[]> {
    const url = `mcs/get_color`;
    const params = {};
    return this.httpService.get(url, { params }).pipe(map(x => x.json()))
  }

  ReceiveCreate(form) {
    const url = `${this.api}/create_receive`;
    return this.httpClient.post(url, form);

  }

  UploadDoc(files: FileList) {
    const url = `${this.api}/upload_doc`;
    this.fileToUpload = files.item(0);
    //var fileToUpload = files.item(0);
    let formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    return this.httpClient.post<ReceiveD[]>(url, formData);
  }


}