import { Injectable } from '@angular/core';
import { SaleModel, ContractItemModel, ContractModel } from '../../models/credit';
import { appConfig } from '../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from 'app/core/http.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ISpSearchSale } from 'app/interfaces/credit';
import { ICancelSlip } from 'app/interfaces/cancel-slip.interface';

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

    CancelReceipt(form: ICancelSlip) {
        const api = `${appConfig.apiUrl}/${this.url}/CancelReceipt`;
        return this.http.post(api, form);
    }
    CancelSale(form: ICancelSlip) {
        const api = `${appConfig.apiUrl}/${this.url}/CancelSale`;
        return this.http.post(api, form);
    }
    CancelCommisstion(form: ICancelSlip) {
        const api = `${appConfig.apiUrl}/${this.url}/CancelCommisstion`;
        return this.http.post(api, form);
    }
    CancelReserveReturn(form: ICancelSlip) {
        const api = `${appConfig.apiUrl}/${this.url}/CancelReserveReturn`;
        return this.http.post(api, form);
    }
    CancelInvTaxRec(form: ICancelSlip) {
        const api = `${appConfig.apiUrl}/${this.url}/CancelInvTaxRec`;
        return this.http.post(api, form);
    }

    SearchSale(form: any): Observable<ISpSearchSale[]> {
        const apiUrl = `${this.url}/SearchSale`;
        const params = { ...form };
        return this.httpService.get(apiUrl, { params }).pipe(map(x => x.json()));
    }

    changeData(data: SaleModel) {
        this.dataSource.next(data)
    }

    GetAction(saleId: string) {
        const apiURL = `${appConfig.apiUrl}/${this.url}/${saleId}`;
        return this.http.get<SaleModel>(apiURL);
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
