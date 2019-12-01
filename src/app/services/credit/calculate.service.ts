import { Injectable } from '@angular/core';
import { CalculateModel, ContractItemModel, ContractModel } from '../../models/credit';
import { appConfig } from '../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from 'app/core/http.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CalculateService {
    private model = new CalculateModel();
    private dataSource = new BehaviorSubject<CalculateModel>(this.model);
    private url = 'Credit/Calculates';
    private httpOptions = {
        headers: new HttpHeaders(
            {
                'Content-Type': 'application/json'
            })
    };

    currentData = this.dataSource.asObservable();

    constructor(
        private http: HttpClient,
        private httpService: HttpService
    ) { }

    changeData(data: CalculateModel) {
        this.dataSource.next(data)
    }

    GetById(calculateId: string) {
        const apiURL = `${this.url}/GetById`;
        const params = { calculateId };
        return this.httpService.get(apiURL, { params })
        .pipe(
            catchError(this.onCatch)
        );
    }

    GetEngineByKeyword(bookingId: string, branchId: string, term: string) {
        const apiURL = `${appConfig.apiUrl}/${this.url}/GetEngineByKeyword`;
        const params = { bookingId, branchId, term };
        return this.http.get<any>(apiURL, { params })
            .pipe(
                catchError(this.onCatch)
            );
    }

    Create(creditCalculate: CalculateModel, creditContract: ContractModel, creditContactItem: ContractItemModel[]) {
        const params = { creditCalculate, creditContract, creditContactItem };
        const apiURL = `${this.url}/Create`;
        return this.httpService.post(apiURL, params);
    }

    Edit(creditCalculate: CalculateModel, creditContract: ContractModel, creditContactItem: ContractItemModel[]) {
        const params = { creditCalculate, creditContract, creditContactItem };
        const apiURL = `${this.url}/Edit`;
        return this.httpService.post(apiURL, params);
    }

    Revice(creditCalculate: CalculateModel, creditContract: ContractModel, creditContactItem: ContractItemModel[]) {
        const params = { creditCalculate, creditContract, creditContactItem };
        const apiURL = `${this.url}/Revice`;
        return this.httpService.post(apiURL, params);
    }

    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        return Observable.throw(error);
    }

}
