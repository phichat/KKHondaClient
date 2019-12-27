import { Injectable } from '@angular/core';
import { appConfig } from '../../app.config';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Payment } from 'app/models/credit/payment';
import { HttpService } from 'app/core/http.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IContractTransactionReceipt } from 'app/models/credit';

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
    const api = `${appConfig.apiUrl}/${this.url}/${id}`;
    return this.http.get<Payment>(api);
  }

  GetReceiptByContractId(contractId: string): Observable<IContractTransactionReceipt[]> {
    const api = `${appConfig.apiUrl}/${this.url}/GetReceiptByContractId`;
    const params = { contractId };
    return this.http.get<IContractTransactionReceipt[]>(api, { params });
  }

  // CancelContractTerm(param: any): Observable<Payment> {
  //   const params = param;
  //   const api = `${this.url}/CancelItemPayment`;
  //   return this.httpService.post(api, params).pipe(map(x => x.json()));
  // }

  CancelReceiptNo(param: any): Observable<Payment> {
    const params = param;
    const api = `${this.url}/CancelReceiptNo`;
    return this.httpService.post(api, params).pipe(map(x => x.json()));
  }

  CancelTaxInvNo(param: any): Observable<Payment> {
    const params = param;
    const api = `${this.url}/CancelTaxInvNo`;
    return this.httpService.post(api, params).pipe(map(x => x.json()));
  }

  PaymentTerm(payment: any): Observable<Payment> {
    const api = `${this.url}/PaymentTerm`;
    const params = payment;
    return this.httpService.post(api, params).pipe(map(x => x.json()));
  }

}
