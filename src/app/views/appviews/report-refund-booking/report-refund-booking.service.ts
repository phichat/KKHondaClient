import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { HttpService } from 'app/core/http.service';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/Observable';
import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { DropDownModel } from 'app/models/drop-down-model';

@Injectable()
export class ReportRefundBookingService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  apiUrl = `Booking`

  GetBranchAutoComplete(): Observable<DropDownModel[]> {
    return this.httpService.get(`${this.apiUrl}/GetBranchAutoComplete`).pipe(map(x => x.json()))
  }

  GetProductTypeAutoComplete(): Observable<DropDownModel[]> {
    return this.httpService.get(`${this.apiUrl}/GetProductTypeAutoComplete`).pipe(map(x => x.json()))
  }

  GetVersionAutoComplete(): Observable<DropDownModel[]> {
    return this.httpService.get(`${this.apiUrl}/GetVersionAutoComplete`).pipe(map(x => x.json()))
  }

  GetDesignAutoComplete(): Observable<DropDownModel[]> {
    return this.httpService.get(`${this.apiUrl}/GetDesignAutoComplete`).pipe(map(x => x.json()))
  }

  GetColorAutoComplete(): Observable<DropDownModel[]> {
    return this.httpService.get(`${this.apiUrl}/GetColorAutoComplete`).pipe(map(x => x.json()))
  }

  GetBookingNameAutoComplete(): Observable<AutoCompleteModel[]> {
    return this.httpService.get(`${this.apiUrl}/GetBookingNameAutoComplete`).pipe(map(x => x.json()))
  }

  GetRegisNameAutoComplete(): Observable<AutoCompleteModel[]> {
    return this.httpService.get(`${this.apiUrl}/GetRegisNameAutoComplete`).pipe(map(x => x.json()))
  }

  GetSellNameAutoComplete(): Observable<DropDownModel[]> {
    return this.httpService.get(`${this.apiUrl}/GetSellNameAutoComplete`).pipe(map(x => x.json()))
  }
}
