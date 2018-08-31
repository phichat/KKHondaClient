import { Injectable } from '@angular/core';
import { appConfig } from '../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContractListModel, ContractModel } from '../../models/credit';

@Injectable()
export class ContractService {

    private url = `${appConfig.apiUrl}/Credit/Contract`;

    private httpOptions = {
        headers: new HttpHeaders(
            {
                'Content-Type': 'application/json'
            })
    };

    constructor(private http: HttpClient) { }

    GetActive() {
        const apiUrl = `${this.url}/Active`;
        return this.http.get<ContractListModel[]>(apiUrl);
    }

    GetCanceled() {
        const apiUrl = `${this.url}/Canceled`;
        return this.http.get<ContractListModel[]>(apiUrl);
    }

    getById(id: string) {
        const api = `${this.url}/GetById`;
        const params = { id };
        return this.http.get<any>(api, { params });
    }

    Detail(contractId: string) {
        const apiURL = `${this.url}/Detail`;
        const params = { contractId };
        return this.http.get<any>(apiURL, { params });
    }

    Edit(creditContract: ContractModel) {
        const params = JSON.stringify(creditContract);
        const apiURL = `${this.url}/Edit`;
        console.log(params);

        return this.http.post<any>(apiURL, params, this.httpOptions);
    }

    Create(creditContract: ContractModel) {
        const params = JSON.stringify(creditContract);
        const apiURL = `${this.url}/Create`;

        return this.http.post<any>(apiURL, params, this.httpOptions);
    }

}
