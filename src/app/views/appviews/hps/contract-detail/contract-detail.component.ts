import { Component, OnInit } from '@angular/core';
import { BookingModel } from '../../../../models/selling';
import { ContractDetailModel, SaleModel } from '../../../../models/credit';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../../../../services/credit';
import { BookingService } from '../../../../services/selling';
import { appConfig, setLocalDate } from '../../../../app.config';
import { Outstanding } from '../../../../models/credit/outstanding-model';
import { DelayedInterestModel } from '../../../../models/credit/delayed-interest.model';
import { DiscountModel } from '../../../../models/credit/discount.model';
import { CutOffSaleModel } from '../../../../models/credit/cut-off-sale.model';
import { HistoryPaymentModel } from '../../../../models/credit/history-payment.model';
import { PageloaderService } from '../../pageloader/pageloader.component';

@Component({
    selector: 'app-contract-detail',
    templateUrl: './contract-detail.component.html'
})
export class ContractDetailComponent implements OnInit {

    contractDetailModel: ContractDetailModel = new ContractDetailModel();
    bookingModel: BookingModel = new BookingModel();
    SaleModel: SaleModel = new SaleModel();
    delayedInterest = new Array<DelayedInterestModel>()
    discount = new Array<DiscountModel>()
    outstanding = new Outstanding()
    cutOffSale = new CutOffSaleModel()
    historyPayment = new HistoryPaymentModel()

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _credit: ContractService,
        private _bookingService: BookingService,
        private pageloader: PageloaderService
    ) { }

    ngOnInit() {
        this.pageloader.setShowPageloader(true);
        this._activatedRoute.queryParams.subscribe(o => {
            if (o.contractId) {
                this._credit.Detail(o.contractId).subscribe(p => {
                    p.creditContractDetail.contractDate = setLocalDate(p.creditContractDetail.contractDate);
                    this.contractDetailModel = p.creditContractDetail;

                    p.creditCalculate.firstPayment = setLocalDate(p.creditCalculate.firstPayment)
                    this.SaleModel = p.creditCalculate;
                    this.bookingModel = p.booking;

                    p.outstanding.nextDueDate = setLocalDate(p.outstanding.nextDueDate);
                    this.outstanding = p.outstanding;

                    p.delayedInterest.map(item => {
                        item.dueDate = setLocalDate(item.dueDate);
                    })
                    this.delayedInterest = p.delayedInterest;

                    p.discounts.map(item => {
                        item.dueDate = setLocalDate(item.dueDate);
                    })
                    this.discount = p.discounts
                    this.cutOffSale = p.cutOffSale
                    this.historyPayment = p.historyPayment
                    this._bookingService.changeData(p.booking);
                });
            }
        });
        this.pageloader.setShowPageloader(false);

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

        if (f.sumCutOffCash) {
            window.open(`${appConfig.reportUrl}/Credits/index.aspx?${contract}&sumCutOffCash=true`)
        }

        if (f.sumDiscountByTerm) {
            window.open(`${appConfig.reportUrl}/Credits/index.aspx?${contract}&sumDiscountByTerm=true`)
        }

        if (f.sumInterestDelay) {
            window.open(`${appConfig.reportUrl}/Credits/index.aspx?${contract}&sumInterestDelay=true`)
        }

        if (f.sumOutstanding) {
            window.open(`${appConfig.reportUrl}/Credits/index.aspx?${contract}&sumOutstanding=true`)
        }

        if (f.sumPaymentHistory) {
            window.open(`${appConfig.reportUrl}/Credits/index.aspx?${contract}&sumPaymentHistory=true`)
        }
    }

}
