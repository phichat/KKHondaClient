import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, DoCheck, OnChanges, OnDestroy } from '@angular/core';
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
export class ContractItemComponent implements OnInit, DoCheck, OnDestroy {


    balanchNetTotol: number;
    principalTotal: number;
    interestTotal: number;
    balanchVatTotal: number;

    private subDest: any;

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
            this.subDest = this._calService.currentData.subscribe(p => {
                this.chRef.markForCheck();

                this.contractItemModel = new Array<ContractItemModel>();

                const vatUp = 1 + (p.nowVat / 100);
                const instalmentEnd = p.instalmentEnd;
                const firstPay = getDateMyDatepicker(p.firstPayment);
                
                // เงินจองถอด vat
                const depositPriceExcVat = (this.currencyToFloat(p.depositPrice) / vatUp);

                // ค่างวดถอด vat
                const instalmentExcVat = (p.instalmentPrice / vatUp);

                // ค่าสินค้า(ราคายืน) ถอด vat
                const itemPrice = (p.netPrice / vatUp);

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

                    let item = new ContractItemModel();
                    const preIndex = (i === 0) ? 0 : i - 1;

                    const depositPrice = this.currencyToFloat(p.depositPrice)
                    const balance = (i === 0) ? depositPriceExcVat : instalmentExcVat;
                    const balanceVatPrice = (i === 0) ? depositPrice - depositPriceExcVat : p.instalmentPrice - balance;
                    const balanceNetPrice = (i === 0) ? depositPrice : p.instalmentPrice;

                    // เงินตั้งต้น
                    let initialPrice = 0;
                    if (i == 1) {
                        initialPrice = itemPrice;
                    }
                    else if (i > 1) {
                        initialPrice = this.contractItemModel[preIndex].principalRemain;
                    };

                    // ดอกเบี้ยค่าเช่าซื้อ
                    const interestInstalment = (initialPrice * p.irr) / 100;
                    // เงินต้น
                    const principal = balance - interestInstalment;
                    // เงินต้นคงเหลือ
                    const principalRemain = (i == 0) ? p.netPrice : initialPrice - principal;

                    this._userService.currentData.subscribe(user => item.contractBranchId = user.branch);

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
                    item.principalRemain = principalRemain < 0.00 ? 0.00 : principalRemain;

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
                item.dueDate = setLocalDate(item.dueDate);
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

        await this.contractItemModel.map(o => {
            this.balanchNetTotol += o.balanceNetPrice;
            this.principalTotal += o.principal;
            this.interestTotal += o.interestInstalment;
            this.balanchVatTotal += o.balanceVatPrice;
        });

        this.contractItemModel.map((o, i) => {
            const preIndex = (i === 0) ? 0 : i - 1;

            if (i == 1) {
                // ดอกเบี้ยเงินต้นคงเหลือ
                o.interestPrincipalRemain = this.interestTotal - o.interestInstalment;
                // ส่วนลดดอกเบี้ย 50%
                o.discountInterest = o.interestPrincipalRemain * (50 / 100)
            } else if (i > 1) {
                // ดอกเบี้ยเงินต้นคงเหลือ
                o.interestPrincipalRemain = this.contractItemModel[preIndex].interestPrincipalRemain - o.interestInstalment;
                // ส่วนลดดอกเบี้ย 50%
                o.discountInterest = o.interestPrincipalRemain * (50 / 100)
            } else {
                o.interestPrincipalRemain = 0;
                o.discountInterest = 0;
            }
        })
    }

    ngOnDestroy(): void {
        // this.subDest.unsubscribe();
    }
}
