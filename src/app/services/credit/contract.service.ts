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

    Get() {
        return this.http.get<ContractListModel[]>(this.url);
    }

    getById(id: string) {
        const api = `${this.url}/GetById`;
        const params = { id };
        return this.http.get<any>(api, { params });
    }

    Edit(creditContract: ContractModel) {
        const params = JSON.stringify( creditContract );
        const apiURL = `${this.url}/Edit`;
        console.log(params);

        return this.http.post<any>(apiURL, params, this.httpOptions);
    }

    Create(creditContract: ContractModel) {
        const params = JSON.stringify( creditContract );
        const apiURL = `${this.url}/Create`;
        console.log(params);

        return this.http.post<any>(apiURL, params, this.httpOptions);
    }

}
