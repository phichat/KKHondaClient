import { Injectable } from '@angular/core';
import { ContractDetailModel } from '../../models/credit';
import { HttpService } from 'app/core/http.service';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs';
import { DropDownModel } from 'app/models/drop-down-model';
import { ContractCustomerListModel, ContractCustomerGroupModel, ContractCustomerGroupListModel, ContractCustomerDetailModel } from 'app/models/credit/contract-customer-model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ContractCustomerService {

    private url = `Credit/ContractCustomer`;
    private urlContract = `Credit/Contract`;

    constructor(
        private httpClient: HttpClient,
        private httpService: HttpService
    ) { }

    CreditContractDetail(contractId: string): Observable<ContractDetailModel> {
        const params = { contractId };
        const api = `${this.urlContract}/CreditContractDetail`;
        return this.httpService.get(api, { params }).pipe(map(x => x.json()));
    }

    SelectDetail(cldId: string): Observable<ContractCustomerDetailModel> {
        const params = { cldId };
        const api = `${this.url}/SelectDetail`;
        return this.httpService.get(api, { params }).pipe(map(x => x.json()));
    }

    ContracNoDropdown(mode: string, contractId: string): Observable<DropDownModel[]> {
        const params = { mode, contractId };
        const api = `${this.url}/ContracNoDropdown`;
        return this.httpService.get(api, { params }).pipe(map(x => x.json()));
    }

    BookNoDropdown(): Observable<DropDownModel[]> {
        const api = `${this.url}/BookNoDropdown`;
        return this.httpService.get(api).pipe(map(x => x.json()));
    }

    CheckGuarantor(bookNo: string): Observable<ContractCustomerListModel> {
        const params = { bookNo };
        const api = `${this.url}/CheckGuarantor`;
        return this.httpService.get(api, { params }).pipe(map(x => x.json()));
    }

    OperatorDropdown(): Observable<DropDownModel[]> {
        const api = `${this.url}/OperatorDropdown`;
        return this.httpService.get(api).pipe(map(x => x.json()));
    }

    StatusDropdown(): Observable<DropDownModel[]> {
        const api = `${this.url}/StatusDropdown`;
        return this.httpService.get(api).pipe(map(x => x.json()));
    }

    GetCustomerContractList(): Observable<ContractCustomerListModel[]> {
        const api = `${this.url}/GetCustomerContractList`;
        return this.httpService.get(api).pipe(map(x => x.json()));
    }

    GetCustomerContract(contractId: string): Observable<ContractCustomerGroupListModel> {
        const params = { contractId };
        const api = `${this.url}/GetCustomerContract`;
        return this.httpService.get(api, { params }).pipe(map(x => x.json()));
    }

    PostCustomerContract(group: ContractCustomerGroupModel): Observable<any> {
        const api = `${this.url}/PostCustomerContract`;
        return this.httpService.post(api, group).pipe(map(x => x.json()));
    }

}
