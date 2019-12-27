import { Injectable } from '@angular/core';
import { ContractModel, ContractItemModel, ContractDetailModel } from '../../models/credit';
import { BookingModel } from '../../models/selling';
import { HttpService } from 'app/core/http.service';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs';
import { ISpContractHps, ISpSearchSale } from 'app/interfaces/credit';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { CustomerModel } from 'app/models/customers';

@Injectable()
export class ContractService {

    private url = `Credit/Contract`;

    constructor(
        private httpClient: HttpClient,
        private httpService: HttpService
    ) { }

    GetActive() {
        const apiUrl = `${this.url}/Active`;
        return this.httpService.get(apiUrl).pipe(map(x => x.json()));
    }

    GetCanceled() {
        const apiUrl = `${this.url}/Canceled`;
        return this.httpService.get(apiUrl).pipe(map(x => x.json()));
    }

    GetCloseContract() {
        const apiUrl = `${this.url}/CloseContract`;
        return this.httpService.get(apiUrl).pipe(map(x => x.json()));
    }

    GetOtherContract() {
        const apiUrl = `${this.url}/OtherContract`;
        return this.httpService.get(apiUrl).pipe(map(x => x.json()));
    }

    getById(id: string) {
        const api = `${this.url}/GetById`;
        const params = { id };
        return this.httpService.get(api, { params }).pipe(map(x => x.json()));
    }

    GetContractItem(contractId: string): Observable<ContractItemModel[]> {
        const api = `${appConfig.apiUrl}/${this.url}/GetContractItem`;
        const params = { contractId };
        return this.httpClient.get<ContractItemModel[]>(api, { params });
    }

    Detail(contractId: string) {
        const apiURL = `${this.url}/Detail`;
        const params = { contractId };
        return this.httpService.get(apiURL, { params }).pipe(map(x => x.json()));
    }

    Edit(creditContract: ContractModel, booking: BookingModel) {
        const params = { contract: creditContract, booking };
        const apiURL = `${this.url}/Edit`;

        return this.httpService.post(apiURL, params);
    }

    Create(creditContract: ContractModel, booking: BookingModel) {
        const params = { contract: creditContract, booking };
        const apiURL = `${this.url}/Create`;

        return this.httpService.post(apiURL, params);
    }

    Termination(from: any) {
        const params = from;
        const apiURL = `${this.url}/ContractTermination`;

        return this.httpService.post(apiURL, params);
    }
}
