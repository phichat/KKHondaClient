import { Injectable } from '@angular/core';
import { appConfig } from '../../app.config';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Payment } from 'app/models/credit/payment';

@Injectable()
export class PaymentService {

  private url = `${appConfig.apiUrl}/Credit/Contract`;

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  constructor(private http: HttpClient) { }

  GetByContractId(id: string) {
    const api = `${this.url}/CreditPayment/${id}`;
    return this.http.get<Payment>(api);
  }

  CancelContractTerm(param: any) {
    const params = JSON.stringify(param);
    const api = `${this.url}/CreditPayment/CancelItemPayment`;
    return this.http.post<Payment>(api, params, this.httpOptions);
  }

  PaymentTerm(payment: any) {
    const api = `${this.url}/CreditPayment/PaymentTerm`;
    const params = JSON.stringify(payment);
    return this.http.post<any>(api, params, this.httpOptions);
  }

}
