import { Injectable } from '@angular/core';
import { CalculateModel, ContractItemModel, ContractModel } from '../../models/credit';
import { appConfig } from '../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CalculateService {
    private model = new CalculateModel();
    private dataSource = new BehaviorSubject<CalculateModel>(this.model);
    private url = `${appConfig.apiUrl}/Credit/Calculates`;
    private httpOptions = {
        headers: new HttpHeaders(
            {
                'Content-Type': 'application/json'
            })
    };

    currentData = this.dataSource.asObservable();

    constructor(private http: HttpClient) { }

    changeData(data: CalculateModel) {
        this.dataSource.next(data)
    }

    GetById(calculateId: string) {
        const apiURL = `${this.url}/GetById`;
        const params = { calculateId };

        return this.http.get<any>(apiURL, { params });
    }

    GetModelNumber(term: string) {
        const apiURL = `${this.url}/GetById`;
        const params = { term };

        return this.http.get<any>(apiURL, { params });
    }

    Create(creditCalculate: CalculateModel, creditContract: ContractModel, creditContactItem: ContractItemModel[]) {
        const params = JSON.stringify({ creditCalculate, creditContract, creditContactItem });
        const apiURL = `${this.url}/Create`;
        return this.http.post<any>(apiURL, params, this.httpOptions);
    }

    Edit(creditCalculate: CalculateModel, creditContract: ContractModel, creditContactItem: ContractItemModel[]) {
        const params = JSON.stringify({ creditCalculate, creditContract, creditContactItem });
        const apiURL = `${this.url}/Edit`;
        return this.http.post<any>(apiURL, params, this.httpOptions);
    }

    Revice(creditCalculate: CalculateModel, creditContract: ContractModel, creditContactItem: ContractItemModel[]) {
        const params = JSON.stringify({ creditCalculate, creditContract, creditContactItem });
        const apiURL = `${this.url}/Revice`;
        return this.http.post<any>(apiURL, params, this.httpOptions);
    }

}
