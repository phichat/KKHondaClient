import { Injectable } from '@angular/core';
import { appConfig } from '../../app.config';
// import { ModelCustomer } from '../../models/selling';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PersonService {

  constructor(private http: HttpClient) { }

  // getAll() {
  //   const apiURL = `${appConfig.apiUrl}/Customers/Personal`;
  //   return this.http.get<ModelCustomer[]>(apiURL);
  // }

  // filterByKey(term) {
  //   const apiUrl = `${appConfig.apiUrl}/Customers/Personal/FilterByKey`;
  //   const params = { term }
  //   return this.http.get<ModelCustomer[]>(apiUrl, { params });
  // }

}
