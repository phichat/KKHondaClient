import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, DoCheck, OnChanges } from '@angular/core';
import { ContractItemModel } from '../../../../models/credit';
import { CalculateService } from '../../../../services/credit';
import { UserService } from '../../../../services/users';
import { getDateMyDatepicker, setLocalDate } from '../../../../app.config';

declare var $: any;
declare var footable: any;

@Component({
    selector: 'app-contract-item',
    templateUrl: './contract-item.component.html',
    styleUrls: ['./contract-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractItemComponent implements OnInit, DoCheck {

    balanchNetTotol: number;
    principalTotal: number;
    interestTotal: number;
    balanchVatTotal: number;
    principalRemainTotal: number;

    @Input() contractItemModel: ContractItemModel[];

    constructor(
        private chRef: ChangeDetectorRef,
        private _calService: CalculateService,
        private _userService: UserService
    ) {
        // this.chRef.detach();
    }

    currencyToFloat(str: any) {
        if (!str)
            return 0;

        str = str.toString();
        return parseFloat(str.replace(/,/i, ''));
    }

    ngOnInit() {
        if (this.contractItemModel.length === 0) {
            this._calService.currentData.subscribe(p => {
                this.chRef.markForCheck();

                this.contractItemModel = new Array<ContractItemModel>()

                const vatUp = 1 + (p.nowVat / 100);
                const instalmentEnd = p.instalmentEnd;
                const firstPay = getDateMyDatepicker(p.firstPayment);

                // เงินจองถอด vat
                const depositPriceExcVat = (this.currencyToFloat(p.depositPrice) / vatUp);

                // ค่างวดถอด vat
                const instalmentExcVat = (p.instalmentPrice / vatUp);

                // ค่าสินค้า(ราคายืน) ถอด vat
                // const itemPriceExcVat 
                const itemPrice = (p.netPrice / vatUp);

                // ยอดจัดถอด - ราคาซาก
                const remainExcVat = p.remain - p.carcassPrice // (p.remain / vatUp);

                // ค่าเฉลี่ยดอกเบี้ยต่อปี
                // const avgMrr = p.mrr / p.instalmentEnd

                let j = 1;
                for (let i = 0; i <= instalmentEnd; i++) {

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
                    // const depositPrice = this.currencyToFloat(p.depositPrice)
                    // const balance = (i === 0) ? depositPriceExcVat : instalmentExcVat;
                    // const balanceVatPrice = (i === 0) ? depositPrice - depositPriceExcVat : p.instalmentPrice - balance;
                    // const balanceNetPrice = (i === 0) ? depositPrice : p.instalmentPrice;
                    const depositPrice = this.currencyToFloat(p.depositPrice)
                    const balance = (i === 0) ? depositPriceExcVat : instalmentExcVat;
                    const balanceVatPrice = (i === 0) ? depositPrice - depositPriceExcVat : p.instalmentPrice - balance;
                    const balanceNetPrice = (i === 0) ? depositPrice : p.instalmentPrice;

                    let initialPrice = 0;
                    let principal = 0;
                    let interestPrincipalRemain = 0;
                    let interestInstalment = 0;

                    if (i == 1) {
                        initialPrice = itemPrice;
                        // // จำนวนดอกเบี้ยที่ต้องชำระ ถอด vat
                        // const interestPriceExVat = (p.interestPrice / ((p.nowVat + 100) / 100))
                        // // ดอกเบี้ยเงินต้นคงเหลือ
                        // interestPrincipalRemain = interestPriceExVat - interestInstalment;
                    }
                    else if (i > 1) {
                        initialPrice = this.contractItemModel[preIndex].principalRemain;
                        // // ดอกเบี้ยค่าเช่าซื้อ
                        // interestInstalment = (initialPrice * p.irr) / 100;
                        // // ดอกเบี้ยเงินต้นคงเหลือ
                        // interestPrincipalRemain = this.contractItemModel[preIndex].interestPrincipalRemain - interestInstalment; 
                    };
                    // ดอกเบี้ยค่าเช่าซื้อ
                    interestInstalment = (initialPrice * p.irr) / 100;
                    // เงินต้น
                    principal = balance - interestInstalment;
                    // เงินต้นคงเหลือ
                    const principalRemain = (i == 0) ? p.netPrice : initialPrice - principal;


                    // งวดที่ 0 หรือเงินดาวน์จะไม่ถูกหักเงินดาวน์ เนื่องจากยอดจัดถูกหักดาวน์ไปแล้ว
                    // const preRemain = (i === 0) ? remainExcVat : (this.contractItemModel[preIndex].goodsPriceRemain);
                    // const remain = (i == 0) ?  remainExcVat : remainExcVat - (balance * i);
                    // const remainVatPrice = (remain * vatUp) - remain;
                    // const remainNetPrice = remain + remainVatPrice;

                    // ดอกเบี้ย
                    // const interestInstalment = (initialPrice * avgMrr) / 100;
                    // const preGoodsPriceRemail = (i === 0) ? 0 : (this.contractItemModel[preIndex].goodsPriceRemain);
                    // const interestInstalment = (i === 0) ? 0 : ((preGoodsPriceRemail * p.irr) / 100);

                    // ค่าสินค้าคงเหลือ
                    // const goodsPrice = (i === 0) ? balance : balance - interestInstalment;
                    // const goodsPriceRemain = (i === 0) ? itemPriceExcVat - balance : preGoodsPriceRemail - goodsPrice;

                    this._userService.currentData.subscribe(user => item.contractBranchId = user.branchId);

                    item.instalmentNo = i;
                    item.dueDate = setLocalDate(dueDate.toString());
                    item.vatRate = p.nowVat;
                    item.balance = (balance);
                    item.balanceVatPrice = balanceVatPrice;
                    item.balanceNetPrice = (balanceNetPrice);

                    // เงินตั้งต้น
                    item.initialPrice = initialPrice;
                    // เงินต้น
                    item.principal = principal;
                    // ดอกเบี้ย
                    item.interestInstalment = interestInstalment;
                    // เงินต้นคงเหลือ
                    item.principalRemain = principalRemain;
                    // ดอกเบี้ยเงินต้นคงเหลือ
                    // item.interestPrincipalRemain = interestPrincipalRemain;
                    // item.remain = remain;
                    // item.remainVatPrice = remainVatPrice;
                    // item.remainNetPrice = remainNetPrice;


                    // ค่าสินค้า
                    // item.goodsPrice = goodsPrice;
                    // // ค่าสินค้าคงเหลือ
                    // item.goodsPriceRemain = goodsPriceRemain < 0 ? 0 : goodsPriceRemain;

                    this.contractItemModel.push(item);
                }

                this.setTotal();
            })
        }
    }

    ngDoCheck() {
        if (this.contractItemModel.length > 0 && this.balanchNetTotol == 0) {
            this.chRef.markForCheck();

            this.contractItemModel.map((item, i) => {
                item.dueDate = setLocalDate(item.dueDate.toString());
            })
            this.setTotal();
        }
    }

    ceil10(int: number) {
        return (Math.ceil(int / 10) * 10);
    }

    async setTotal() {
        this.balanchNetTotol = 0;
        this.principalTotal = 0;
        this.interestTotal = 0;
        this.balanchVatTotal = 0;

        await this.contractItemModel.map((o, i) => {
            this.balanchNetTotol += o.balanceNetPrice;
            this.principalTotal += o.principal;
            this.interestTotal += o.interestInstalment;
            this.balanchVatTotal += o.balanceVatPrice;
            this.principalRemainTotal += o.principalRemain;

            const preIndex = (i === 0) ? 0 : i - 1;
            if (i == 1) {
                // ดอกเบี้ยเงินต้นคงเหลือ
                o.interestPrincipalRemain = this.principalRemainTotal - o.interestInstalment;
            } else if (i > 2) {
                o.interestPrincipalRemain = this.contractItemModel[preIndex].interestPrincipalRemain - o.interestInstalment; 
            }
        });

        // this.contractItemModel. 
    }
}
