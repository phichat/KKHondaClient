import { Component, OnInit } from '@angular/core';
import { ContractDetailModel } from '../../../../models/credit';
import { BookingModel } from '../../../../models/selling';
import { ContractService } from '../../../../services/credit';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-contract-canceled',
    templateUrl: './contract-canceled.component.html'
})
export class ContractCanceledComponent implements OnInit {

    contractDetailModel: ContractDetailModel;
    bookingModel: BookingModel;
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _credit: ContractService
    ) { }

    ngOnInit() {
        this._activatedRoute.queryParams.subscribe(o => {
            if (o.contractId) {
                this._credit.Detail(o.contractId).subscribe(p => {
                    this.contractDetailModel = p.creditContractDetail;
                    this.bookingModel = p.booking;
                });
            }
        });

    }

    onSubmit(f: any) {

    }
}
