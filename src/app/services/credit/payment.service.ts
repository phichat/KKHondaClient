import { Injectable } from '@angular/core';
import { appConfig } from '../../app.config';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Payment } from 'app/models/credit/payment';
import { HttpService } from 'app/core/http.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentService {

  private url = `Credit/Contract/CreditPayment`;

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  constructor(
    private http: HttpClient,
    private httpService: HttpService
    ) { }

  GetByContractId(id: string): Observable<Payment> {
    const api = `${this.url}/${id}`;
    return this.httpService.get(api).pipe(map(x => x.json()));
  }

  CancelContractTerm(param: any) {
    const params = JSON.stringify(param);
    const api = `${this.url}/CancelItemPayment`;
    return this.httpService.post(api, params);
  }

  PaymentTerm(payment: any) {
    const api = `${this.url}/PaymentTerm`;
    const params = JSON.stringify(payment);
    return this.httpService.post(api, params);
  }

}
