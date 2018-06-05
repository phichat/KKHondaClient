import { Injectable } from '@angular/core';
import { appConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ContractService {

    private url = `${appConfig.apiUrl}/Credit/Contract`;

    constructor(private http: HttpClient) { }

    getById(id: string) {
        const api = `${this.url}/GetById`;
        const params = { id };
        return this.http.get<any>(api, { params });
    }

}
