import { Injectable } from '@angular/core';
import { ContractModel } from '../../models/credit';
import { BookingModel } from '../../models/selling';
import { HttpService } from 'app/core/http.service';

@Injectable()
export class ContractService {

    private url = `Credit/Contract`;

    constructor(
        private httpService: HttpService
        ) { }

    GetActive() {
        const apiUrl = `${this.url}/Active`;
        return this.httpService.get(apiUrl);
    }

    GetCanceled() {
        const apiUrl = `${this.url}/Canceled`;
        return this.httpService.get(apiUrl);
    }

    GetCloseContract() {
        const apiUrl = `${this.url}/CloseContract`;
        return this.httpService.get(apiUrl);
    }

    GetOtherContract() {
        const apiUrl = `${this.url}/OtherContract`;
        return this.httpService.get(apiUrl);
    }

    getById(id: string) {
        const api = `${this.url}/GetById`;
        const params = { id };
        return this.httpService.get(api, { params });
    }

    Detail(contractId: string) {
        const apiURL = `${this.url}/Detail`;
        const params = { contractId };
        return this.httpService.get(apiURL, { params });
    }

    Edit(creditContract: ContractModel, booking: BookingModel) {
        const params = JSON.stringify({contract: creditContract, booking});
        const apiURL = `${this.url}/Edit`;

        return this.httpService.post(apiURL, params);
    }

    Create(creditContract: ContractModel, booking: BookingModel) {
        const params = JSON.stringify({contract: creditContract, booking});
        const apiURL = `${this.url}/Create`;

        return this.httpService.post(apiURL, params);
    }

    Termination(from: any) {
        const params = JSON.stringify(from);
        const apiURL = `${this.url}/ContractTermination`;

        return this.httpService.post(apiURL, params);
    }

}
