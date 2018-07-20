import { Component, OnInit } from '@angular/core';
import { BookingModel } from '../../../../models/selling';
import { ContractDetailModel, CalculateModel, ContractItemModel } from '../../../../models/credit';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../../../../services/credit';
import { BookingService } from '../../../../services/selling';
import { Form } from '@angular/forms';
import { appConfig } from 'app/app.config';

@Component({
    selector: 'app-contract-detail',
    templateUrl: './contract-detail.component.html'
})
export class ContractDetailComponent implements OnInit {

    contractDetailModel: ContractDetailModel = new ContractDetailModel();
    bookingModel: BookingModel = new BookingModel();
    calculateModel: CalculateModel = new CalculateModel();
    contractItemModel: Array<ContractItemModel> = new Array<ContractItemModel>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _credit: ContractService,
        private _bookingService: BookingService
    ) { }

    ngOnInit() {
        this._activatedRoute.queryParams.subscribe(o => {
            if (o.contractId) {
                this._credit.Detail(o.contractId).subscribe(p => {
                    this.contractDetailModel = p.creditContractDetail;
                    this.calculateModel = p.creditCalculate;
                    this.contractItemModel = p.creditContractItem;
                    this.bookingModel = p.booking;
                    this._bookingService.changeData(p.booking);
                });
            }
        });

    }

    onPrint(f: any) {
        let contract = `contractId=${f.contractId}`;
     
        if (f.formContract) {
            window.open(`${appConfig.reportUrl}/Credits/index.aspx?${contract}&formContract=true`);
        }
        if (f.formInstalmentTerm) {
            window.open(`${appConfig.reportUrl}/Credits/index.aspx?${contract}&formInstalmentTerm=true`);
        }
        if (f.formTransfer) {
            window.open(`${appConfig.reportUrl}/Credits/index.aspx?${contract}&formTransfer=true`);
        }
    }

}
