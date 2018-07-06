import { Component, OnInit } from '@angular/core';
import { BookingModel } from '../../../../models/selling';
import { ContractDetailModel, CalculateModel, ContractItemModel } from '../../../../models/credit';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../../../../services/credit';
import { BookingService } from '../../../../services/selling';
import { Form } from '@angular/forms';

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

    onPrint(f: Form) {
        console.log(f);
    }

}
