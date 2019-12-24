import { Injectable } from '@angular/core';
import { SaleModel, ContractItemModel, ContractModel } from '../../models/credit';
import { appConfig } from '../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from 'app/core/http.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SaleService {
    private model = new SaleModel();
    private dataSource = new BehaviorSubject<SaleModel>(this.model);
    private url = 'Credit/Sale';
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

    changeData(data: SaleModel) {
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

    Create(sale: SaleModel, creditContract: ContractModel, creditContactItem: ContractItemModel[]) {
        const params = { sale, creditContract, creditContactItem };
        const apiURL = `${this.url}/Create`;
        return this.httpService.post(apiURL, params);
    }

    Edit(sale: SaleModel, creditContract: ContractModel, creditContactItem: ContractItemModel[]) {
        const params = { sale, creditContract, creditContactItem };
        const apiURL = `${this.url}/Edit`;
        return this.httpService.post(apiURL, params);
    }

    Revice(sale: SaleModel, creditContract: ContractModel, creditContactItem: ContractItemModel[]) {
        const params = { sale, creditContract, creditContactItem };
        const apiURL = `${this.url}/Revice`;
        return this.httpService.post(apiURL, params);
    }

    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        return Observable.throw(error);
    }

}
