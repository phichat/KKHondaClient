import { Injectable } from '@angular/core';
import { CalculateModel, ContractItemModel } from '../../models/credit';
import { appConfig } from '../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CalculateService {
    private model = new CalculateModel();
    private dataSource = new BehaviorSubject<CalculateModel>(this.model);
    private url = `${appConfig.apiUrl}/Credit`;
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

    Add(calculate: CalculateModel, creditContactItem: ContractItemModel) {
        const apiURL = `${this.url}/Calculates`;
        const params = { calculate };

        return this.http.post(apiURL, {params} , this.httpOptions);
    }

}
