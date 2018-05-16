import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';

@Injectable()
export class CustomerService {

  constructor(private http: HttpClient) { }

  // getAll(){
  //   const apiURL = `${appConfig.apiUrl}/Customers/Customer`;
  //   return this.http.get<ModelCustomer[]>(apiURL);
  // }
}
