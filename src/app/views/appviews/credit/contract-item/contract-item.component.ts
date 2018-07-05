import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, DoCheck, OnChanges } from '@angular/core';
import { ContractItemModel } from '../../../../models/credit';
import { CalculateService } from '../../../../services/credit';
import { UserService } from '../../../../services/users';

declare var $: any;
declare var footable: any;

@Component({
    selector: 'app-contract-item',
    templateUrl: './contract-item.component.html',
    styleUrls: ['./contract-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractItemComponent implements OnInit, DoCheck {

    // contractItemModel: ContractItemModel[];
    balanchTotal: number;
    balanchVatTotal: number;
    balanchNetTotol: number;
    interestTotal: number;
    goodPriceTotal: number;

    @Input() contractItemModel: ContractItemModel[];

    constructor(
        private chRef: ChangeDetectorRef,
        private _calService: CalculateService,
        private _userService: UserService
    ) {
        // this.chRef.detach();
    }

    ngOnInit() {
        if (this.contractItemModel.length === 0) {
            this._calService.currentData.subscribe(p => {

                this.chRef.markForCheck();

                this.contractItemModel = new Array<ContractItemModel>()

                const vatUp = 1 + (p.nowVat / 100);
                const instalmentEnd = p.instalmentEnd;
                const firstPay = new Date(p.firstPayment);

                // เงินจองถอด vat
                const depositPriceExcVat = (p.depositPrice / vatUp);
                // ค่างวดถอด vat
                const instalmentExcVat = (p.instalmentPrice / vatUp);
                // ค่าสินค้าถอด vat
                const itemPriceExcVat = (p.netPrice / vatUp);
                // ยอดจัดถอด vat
                const netPriceExcVat = (p.netPrice / vatUp);

                let j = 1;
                for (let i = 0; i <= instalmentEnd; i++) {

                    // tslint:disable-next-line:prefer-const
                    let d: Date = (new Date);
                    let dueDate: Date = firstPay;

                    if (i > 0) {
                        const month = (firstPay.getMonth()) + j;
                        const year = (firstPay.getFullYear() + j);
                        d.setDate(p.dueDate);

                        if (p.typePayment == '0') {
                            // ชำระรายงวดห
                            d.setMonth(month);
                        } else if (p.typePayment == '1') {
                            // ชำระรายปี
                            d.setFullYear(year);
                        }

                        dueDate = d;
                        j++;
                    }

                    // tslint:disable-next-line:prefer-const
                    let item = new ContractItemModel();
                    const preIndex = (i === 0) ? 0 : i - 1;

                    // ค่างวดไม่รวม vat
                    // i : จำนวนรายการ
                    // i = 0: รายการเงินดาน์
                    // i > 0: รายการผ่อน
                    const balance = (i === 0) ? depositPriceExcVat : instalmentExcVat;
                    const balanceVatPrice = (i === 0) ? p.depositPrice - depositPriceExcVat : p.instalmentPrice - balance;
                    const balanceNetPrice = (i === 0) ? p.depositPrice : p.instalmentPrice;

                    const rNet = netPriceExcVat - depositPriceExcVat;
                    const remain = (i === 0) ? rNet : rNet - (instalmentExcVat * i);
                    const remainVatPrice = (remain * vatUp) - remain;
                    const remainNetPrice = remain + remainVatPrice;

                    // ดอกเบี้ย
                    const preGoodsPriceRemail = (i === 0) ? 0 : (this.contractItemModel[preIndex].goodsPriceRemain);
                    const interestInstalment = (i === 0) ? 0 : ((preGoodsPriceRemail * p.irr) / 100);

                    // ค่าสินค้าคงเหลือ
                    const goodsPrice = (i === 0) ? balance : balance - interestInstalment;
                    const goodsPriceRemain = (i === 0) ? itemPriceExcVat - balance : preGoodsPriceRemail - goodsPrice;

                    this._userService.currentData.subscribe(user => item.contractBranchId = user.branchId);
                    item.instalmentNo = i;
                    item.dueDate = dueDate;
                    item.vatRate = p.nowVat;
                    item.balance = (balance);
                    item.balanceVatPrice = balanceVatPrice;
                    item.balanceNetPrice = (balanceNetPrice);

                    item.remain = remain;
                    item.remainVatPrice = remainVatPrice;
                    item.remainNetPrice = remainNetPrice;

                    // ดอกเบี้ย
                    item.interestInstalment = interestInstalment;
                    // ค่าสินค้า
                    item.goodsPrice = goodsPrice;
                    // ค่าสินค้าคงเหลือ
                    item.goodsPriceRemain = goodsPriceRemain < 0 ? 0 : goodsPriceRemain;

                    this.contractItemModel.push(item);
                }

                this.setTotal();
            })
        }
    }

    ngDoCheck() {
        if (this.contractItemModel.length > 0 && this.balanchNetTotol == 0) {
            this.chRef.markForCheck();
            this.setTotal();
        }
    }

    ceil10(int: number) {
        return (Math.ceil(int / 10) * 10);
    }

    setTotal() {
        this.balanchTotal = 0;
        this.balanchVatTotal = 0;
        this.balanchNetTotol = 0;
        this.interestTotal = 0;
        this.goodPriceTotal = 0;
        this.contractItemModel.map(o => {
            this.balanchTotal += o.balance;
            this.balanchVatTotal += o.balanceVatPrice;
            this.balanchNetTotol += o.balanceNetPrice;
            this.interestTotal += o.interestInstalment;
            this.goodPriceTotal += o.goodsPrice;
        });
    }
}
