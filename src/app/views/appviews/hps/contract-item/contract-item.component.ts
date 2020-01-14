import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, DoCheck, OnDestroy } from '@angular/core';
import { ContractItemModel } from '../../../../models/credit';
import { SaleService } from '../../../../services/credit';
import { UserService } from '../../../../services/users';
import { setLocalDate } from '../../../../app.config';
import { Subject } from 'rxjs';
import { BookingPaymentType } from 'app/entities/mcs.entities';

@Component({
  selector: 'app-contract-item',
  templateUrl: './contract-item.component.html',
  styleUrls: ['./contract-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractItemComponent implements OnInit {

  BookingPaymentType = BookingPaymentType;
  setLocalDate = setLocalDate;

  @Input() contractItemModel: ContractItemModel[];
  @Input() debitTable?: Subject<ContractItemModel[]>;

  constructor(
    private chRef: ChangeDetectorRef,
    private _calService: SaleService,
    private _userService: UserService
  ) { }

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
        const instalmentEnd = p.bookingPaymentType != this.BookingPaymentType.Credit ? p.instalmentEnd : 1;
        const firstPay = p.firstPayment;

        // เงินดาวน์ถอด vat
        const depositPriceExcVat = (this.currencyToFloat(p.depositPrice) / vatUp);

        // ค่างวดถอด vat
        const instalmentExcVat = (p.instalmentPrice / vatUp);

        // ราคาสินค้าคงเหลือ ถอด vat
        const netPriceExcVat = (p.netPrice / vatUp);

        if (p.bookingPaymentType == this.BookingPaymentType.Leasing) {

          let item1 = new ContractItemModel();
          item1.contractBranchId = this._userService.cookies.branchId;
          item1.instalmentNo = 0;
          item1.instalmentNoText = 'เงินดาวน์';
          item1.dueDate = firstPay;
          item1.vatRate = p.nowVat;
          item1.balance = depositPriceExcVat;
          item1.balanceVatPrice = p.depositPrice - depositPriceExcVat;
          item1.balanceNetPrice = p.depositPrice;
          item1.remain = item1.balance;
          item1.remainVatPrice = item1.balanceVatPrice;
          item1.remainNetPrice = item1.balanceNetPrice;
          // เงินตั้งต้น
          item1.initialPrice = item1.balance;
          item1.interestInstalment = 0;
          item1.principal = item1.balance;
          // เงินต้นคงค้าง
          item1.principalRemain = p.netPrice;
          item1.interestPrincipalRemain = 0;
          item1.discountInterest = 0;
          this.contractItemModel.push(item1);

          const dueDate = new Date();
          let item2 = new ContractItemModel();
          item2.contractBranchId = this._userService.cookies.branchId;
          item2.instalmentNo = 1;
          item2.instalmentNoText = 'ยอดคงค้าง'
          item2.dueDate = new Date(dueDate.setDate(dueDate.getDate() + 30));
          item2.vatRate = p.nowVat;
          item2.balance = netPriceExcVat;
          item2.balanceVatPrice = p.netPrice - netPriceExcVat;
          item2.balanceNetPrice = p.netPrice;
          item2.comPrice = p.comPrice
          item2.comPriceRemain = p.comPrice
          item2.remain = item2.balance;
          item2.remainVatPrice = item2.balanceVatPrice;
          item2.remainNetPrice = item2.balanceNetPrice;
          // เงินตั้งต้น
          item2.initialPrice = item2.balance;
          item2.interestInstalment = 0;
          item2.principal = item2.balance;
          // เงินต้นคงค้าง
          item2.principalRemain = 0;
          item2.interestPrincipalRemain = 0;
          item2.discountInterest = 0;
          this.contractItemModel.push(item2);
          return;
        }

        let j = 1;
        for (let i = 0; i <= instalmentEnd; i++) {
          let d: Date = (new Date);
          let dueDate: Date = firstPay;
          let item = new ContractItemModel();

          switch (p.bookingPaymentType) {
            case this.BookingPaymentType.HierPurchase:
              item.instalmentNoText = (i == 0 ? 'เงินดาวน์' : i.toString());
              break;

            case this.BookingPaymentType.Credit:
              item.instalmentNoText = (i == 0 ? 'ชำระส่วนแรก' : 'ยอดคงค้าง');
              break;
          }

          if (i > 0) {
            switch (p.bookingPaymentType) {
              case this.BookingPaymentType.HierPurchase:
                const month = firstPay.getDate() > 20 ? (firstPay.getMonth() + 1) + j : firstPay.getMonth() + j;
                const year = (firstPay.getFullYear() + j);
                d.setDate(p.dueDate);

                if (p.typePayment == '0') {
                  // ชำระรายงวด
                  d.setMonth(month);
                } else if (p.typePayment == '1') {
                  // ชำระรายปี
                  d.setFullYear(year);
                }
                break;

              case this.BookingPaymentType.Credit:
                // กรณีขายเชื่อ
                // เอา ระยะเวลาผ่อนชำระ(เครดิต วัน) มากำหนดวันกำหนดชำระ
                const __instalmentEnd = parseInt((p.instalmentEnd as any).toString());
                d.setDate(d.getDate() + __instalmentEnd);
                break;
            }
            dueDate = d;
            j++;
          }

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
            initialPrice = netPriceExcVat;
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
      })
    }

    if (this.debitTable != null) {
      this.debitTable.subscribe(x => {
        if (!x.length) return;
        this.chRef.markForCheck();
        this.contractItemModel = x;
        // this.setTotal();
      })
    }
  }

  ceil10(int: number) {
    return (Math.ceil(int / 10) * 10);
  }

  get balanchNetTotol(): number {
    return this.contractItemModel.reduce((a, c) => a += c.balanceNetPrice, 0);
  }

  get principalTotal(): number {
    return this.contractItemModel.reduce((a, c) => a += c.principal, 0);
  }

  get interestTotal(): number {
    return this.contractItemModel.reduce((a, c) => a += c.interestInstalment, 0);
  };
  get balanchVatTotal(): number {
    return this.contractItemModel.reduce((a, c) => a += c.balanceVatPrice, 0);
  };

  // async setTotal() {
  //     // this.balanchNetTotol = 0;
  //     // this.principalTotal = 0;
  //     // this.interestTotal = 0;
  //     // this.balanchVatTotal = 0;

  //     // await this.contractItemModel.map(o => {
  //     //     this.balanchNetTotol += o.balanceNetPrice;
  //     //     this.principalTotal += o.principal;
  //     //     this.interestTotal += o.interestInstalment;
  //     //     this.balanchVatTotal += o.balanceVatPrice;
  //     // });

  //     // this.contractItemModel.map((o, i) => {
  //     //     const preIndex = (i === 0) ? 0 : i - 1;

  //     //     if (i == 1) {
  //     //         // ดอกเบี้ยเงินต้นคงเหลือ
  //     //         o.interestPrincipalRemain = this.interestTotal - o.interestInstalment;
  //     //         // ส่วนลดดอกเบี้ย 50%
  //     //         o.discountInterest = o.interestPrincipalRemain * (50 / 100)
  //     //     } else if (i > 1) {
  //     //         // ดอกเบี้ยเงินต้นคงเหลือ
  //     //         o.interestPrincipalRemain = this.contractItemModel[preIndex].interestPrincipalRemain - o.interestInstalment;
  //     //         // ส่วนลดดอกเบี้ย 50%
  //     //         o.discountInterest = o.interestPrincipalRemain * (50 / 100)
  //     //     } else {
  //     //         o.interestPrincipalRemain = 0;
  //     //         o.discountInterest = 0;
  //     //     }
  //     // })
  // }
}
