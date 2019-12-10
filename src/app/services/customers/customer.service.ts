import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { DropDownModel } from '../../models/drop-down-model';
import { CustomerModel } from 'app/models/customers';

@Injectable()
export class CustomerService {

    private url = `${appConfig.apiUrl}/Customers`;

    constructor(private http: HttpClient) { }

    // getAll(){
    //   const apiURL = `${appConfig.apiUrl}/Customers/Customer`;
    //   return this.http.get<ModelCustomer[]>(apiURL);
    // }

    getByKey(term: string) {
        const apiURL = `${this.url}/Customer/GetByKey`;
        const params = { term };
        return this.http.get<DropDownModel[]>(apiURL, { params })
    }

    getCustomerByCode(custCode: string) {
        const apiURL = `${this.url}/customer/GetCustomerByCode`;
        const params = { custCode };
        return this.http.get<CustomerModel>(apiURL, { params });
    }
}
