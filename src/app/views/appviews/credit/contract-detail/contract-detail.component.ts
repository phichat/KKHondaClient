import { Component, OnInit } from '@angular/core';
import { BookingModel } from '../../../../models/selling';
import { ContractDetailModel } from '../../../../models/credit';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../../../../services/credit';
import { BookingService } from '../../../../services/selling';

@Component({
    selector: 'app-contract-detail',
    templateUrl: './contract-detail.component.html'
})
export class ContractDetailComponent implements OnInit {

    contractDetailModel: ContractDetailModel = new ContractDetailModel();
    bookingModel: BookingModel = new BookingModel();
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
                    this.bookingModel = p.booking;
                    this._bookingService.changeData(p.booking);
                });
            }
        });

    }

}
