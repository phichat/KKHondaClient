import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, DoCheck, OnDestroy } from '@angular/core';
import { ContractItemModel } from '../../../../models/credit';
import { SaleService } from '../../../../services/credit';
import { UserService } from '../../../../services/users';
import { setLocalDate } from '../../../../app.config';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-contract-item',
    templateUrl: './contract-item.component.html',
    styleUrls: ['./contract-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractItemComponent implements OnInit, DoCheck, OnDestroy {


    setLocalDate = setLocalDate;
    balanchNetTotol: number;
    principalTotal: number;
    interestTotal: number;
    balanchVatTotal: number;

    @Input() contractItemModel: ContractItemModel[];
    @Input() debitTable?: Subject<ContractItemModel[]>;

    constructor(
        private chRef: ChangeDetectorRef,
        private _calService: SaleService,
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
                if (p.instalmentEnd == undefined || !p.instalmentEnd) return;

                this.chRef.markForCheck();

                this.contractItemModel = new Array<ContractItemModel>();

                const vatUp = 1 + (p.nowVat / 100);
                // กรณีขายเชื่อ จะเซ็ตระยะเวลาผ่อนชำระให้เป็น 1 งวด
                const instalmentEnd = p.bookingPaymentType != 4 ? p.instalmentEnd : 1;
                const firstPay = p.firstPayment;

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
                        if (p.bookingPaymentType != 4) {
                            const month = firstPay.getDate() > 20 ? (firstPay.getMonth() + 1) + j : firstPay.getMonth() + j;
                            const year = (firstPay.getFullYear() + j);
                            d.setDate(p.dueDate);

                            if (p.typePayment == '0') {
                                // ชำระรายงวดห
                                d.setMonth(month);
                            } else if (p.typePayment == '1') {
                                // ชำระรายปี
                                d.setFullYear(year);
                            }
                        } else {
                            // กรณีขายเชื่อ
                            // เอา ระยะเวลาผ่อนชำระ(เครดิต วัน) มากำหนดวันกำหนดชำระ
                            const __instalmentEnd = parseInt((p.instalmentEnd as any).toString());
                            d.setDate(d.getDate() + __instalmentEnd);
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

                    // const remain = remainExcVat - (balance * (i == 0 ? 1 : i));
                    // const remainVatPrice = (remain * vatUp) - remain;
                    // const remainNetPrice = remain + remainVatPrice;

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

                    item.contractBranchId = this._userService.cookies.branchId;
                    item.instalmentNo = i;
                    item.dueDate = dueDate;
                    item.vatRate = p.nowVat;
                    item.balance = (balance);
                    item.balanceVatPrice = balanceVatPrice;
                    item.balanceNetPrice = (balanceNetPrice);

                    item.remain = balance;
                    item.remainVatPrice = balanceVatPrice;
                    item.remainNetPrice = balanceNetPrice;

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

        if (this.debitTable != null) {
            this.debitTable.subscribe(x => {
                if (!x.length) return;
                this.chRef.markForCheck();
                this.contractItemModel = x;
                this.setTotal();
            })
        }
    }

    ngDoCheck() {
        if (this.contractItemModel.length > 0 && this.balanchNetTotol == 0) {
            this.chRef.markForCheck();

            // this.contractItemModel.map((item, i) => {
            //     item.dueDate = setLocalDate(item.dueDate);
            // })
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
