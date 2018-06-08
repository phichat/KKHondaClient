import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef, AfterViewInit, ViewChild } from '@angular/core';
import { CalculateModel, ContractItemModel } from '../../../../models/credit';
import { CalculateService } from '../../../../services/credit';
import { UserService } from '../../../../services/users';

declare var $: any;
declare var footable: any;

@Component({
    selector: 'app-contract-item',
    templateUrl: './contract-item.component.html',
    styleUrls: ['./contract-item.component.scss']
})
export class ContractItemComponent implements OnInit {

    // contractItemModel: ContractItemModel[];

    @Input() contractItemModel: ContractItemModel[];

    constructor(
        private chRef: ChangeDetectorRef,
        private _calService: CalculateService,
        private _userService: UserService
    ) {
    }

    ngOnInit() {

        if (this.contractItemModel.length === 0) {
            this._calService.currentData.subscribe(p => {

                // this.chRef.markForCheck();

                this.contractItemModel = new Array<ContractItemModel>()

                const vatUp = 1 + (p.nowVat / 100);
                const vatDown = (p.nowVat / 100);

                const instalmentEnd = p.instalmentEnd;
                const firstPay = new Date(p.firstPayment);

                const depositPriceExcVat = p.depositPrice / vatUp;
                const instalmentExcVat = p.instalmentPrice / vatUp;
                const itemPriceExcVat = p.netPrice / vatUp;

                let j = 1;
                for (let i = 0; i <= instalmentEnd; i++) {

                    // tslint:disable-next-line:prefer-const
                    let d: Date = (new Date);
                    let dueDate: Date = firstPay;

                    if (i > 0) {
                        const month = (firstPay.getMonth()) + j;
                        d.setMonth(month);
                        d.setDate(p.dueDate);
                        dueDate = d;
                        j++;
                    }

                    // tslint:disable-next-line:prefer-const
                    let item = new ContractItemModel();

                    // ค่างวดไม่รวม vat
                    // i : จำนวนรายการ
                    // i = 0: รายการเงินดาน์
                    // i > 0: รายการผ่อน
                    const balance = (i === 0) ? depositPriceExcVat : instalmentExcVat;
                    const balanceVatPrice = (i === 0) ? p.depositPrice - depositPriceExcVat : p.instalmentPrice - instalmentExcVat;
                    const balanceNetPrice = (i === 0) ? p.depositPrice : p.instalmentPrice;

                    // ดอกเบี้ย
                    const preIndex = (i === 0) ? 0 : i - 1;
                    const preGoodsPriceRemail = (i === 0) ? 0 : (this.contractItemModel[preIndex].goodsPriceRemain);
                    const interestInstalment = (i === 0) ? 0 : (preGoodsPriceRemail * p.irr) / 100;

                    // ค่าสินค้าคงเหลือ
                    const goodsPrice = (i === 0) ? balance : balance - interestInstalment;
                    const goodsPriceRemain = (i === 0) ? itemPriceExcVat - balance : preGoodsPriceRemail - goodsPrice;

                    this._userService.currentData.subscribe(user => item.contractBranchId = user.branchId);
                    item.instalmentNo = i;
                    item.dueDate = dueDate;
                    item.vatRate = p.nowVat;
                    item.balance = balance;
                    item.balanceVatPrice = balanceVatPrice;
                    item.balanceNetPrice = balanceNetPrice;
                    // ดอกเบี้ย
                    item.interestInstalment = interestInstalment;
                    // ค่าสินค้า
                    item.goodsPrice = goodsPrice;
                    // ค่าสินค้าคงเหลือ
                    item.goodsPriceRemain = goodsPriceRemain < 0 ? 0 : goodsPriceRemain;

                    this.contractItemModel.push(item);

                }

            })
        }

    }

}
