import { Component, OnInit } from '@angular/core';
import { BookingModel } from '../../../../models/selling';
import { ContractDetailModel, CalculateModel } from '../../../../models/credit';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../../../../services/credit';
import { BookingService } from '../../../../services/selling';
import { appConfig } from 'app/app.config';
import { Outstanding } from '../../../../models/credit/outstanding-model';
import { DelayedInterestModel } from '../../../../models/credit/delayed-interest.model';
import { DiscountModel } from '../../../../models/credit/discount.model';
import { CutOffSaleModel } from '../../../../models/credit/cut-off-sale.model';
import { HistoryPaymentModel } from '../../../../models/credit/history-payment.model';

@Component({
    selector: 'app-contract-detail',
    templateUrl: './contract-detail.component.html'
})
export class ContractDetailComponent implements OnInit {

    contractDetailModel: ContractDetailModel = new ContractDetailModel();
    bookingModel: BookingModel = new BookingModel();
    calculateModel: CalculateModel = new CalculateModel();
    delayedInterest = new Array<DelayedInterestModel>()
    discount = new Array<DiscountModel>()
    outstanding = new Outstanding()
    cutOffSale = new CutOffSaleModel()
    historyPayment = new HistoryPaymentModel()

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
                    this.bookingModel = p.booking;
                    this.outstanding = p.outstanding;
                    this.delayedInterest = p.delayedInterest;
                    this.discount = p.discounts
                    this.cutOffSale = p.cutOffSale
                    this.historyPayment = p.historyPayment
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
