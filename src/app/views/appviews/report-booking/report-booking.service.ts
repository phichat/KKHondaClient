import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { HttpService } from 'app/core/http.service';

@Injectable()
export class ReportBookingService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  apiUrl = `Booking`

  GetBranchAutoComplete() {
    return this.httpService.get(`${this.apiUrl}/GetBranchAutoComplete`)
  }

  GetProductTypeAutoComplete() {
    return this.httpService.get(`${this.apiUrl}/GetProductTypeAutoComplete`)
  }

  GetVersionAutoComplete() {
    return this.httpService.get(`${this.apiUrl}/GetVersionAutoComplete`)
  }

  GetDesignAutoComplete() {
    return this.httpService.get(`${this.apiUrl}/GetDesignAutoComplete`)
  }

  GetColorAutoComplete() {
    return this.httpService.get(`${this.apiUrl}/GetColorAutoComplete`)
  }

  GetBookingNameAutoComplete() {
    return this.httpService.get(`${this.apiUrl}/GetBookingNameAutoComplete`)
  }

  GetRegisNameAutoComplete() {
    return this.httpService.get(`${this.apiUrl}/GetRegisNameAutoComplete`)
  }
}
