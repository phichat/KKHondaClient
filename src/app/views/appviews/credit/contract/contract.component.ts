import { Component, OnInit } from '@angular/core';
import { CalculateModel } from '../../../../models/credit';
import { UserService } from '../../../../services/users';
import * as moment from 'moment';
import { CalculateService } from '../../../../services/credit';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  model = new CalculateModel();

  sellType = [
    { value: 3, text: 'ลิสซิ่ง' },
    { value: 4, text: 'เช่าซื้อ' }]

  instalmentEnd = [
    { value: 3, text: '3 เดือน' },
    { value: 6, text: '6 เดือน' },
    { value: 9, text: '9 เดือน' }
  ];

  dueDate = [
    { value: 5, text: '5 ของเดือน' },
    { value: 10, text: '10 ของเดือน' },
    { value: 15, text: '15 ของเดือน' },
    { value: 20, text: '20 ของเดือน' },
    { value: 25, text: '25 ของเดือน' },
  ]

  constructor(
    private _calcService: CalculateService,
    private _userService: UserService) { }

  ngOnInit() {
    //   this._activatedRoute.queryParams.subscribe(p => {
    //     if (p.bookingId) {
    //         this.model.bookingId = p.bookingId;
    //         this.onLoadBooking(p.bookingId);
    //     }
    // });

    this._userService.currentData.subscribe(p => {
      this.model.createBy = p.userId;
    })

    for (let i = 1; i < 7; i++) {
      const month = i * 12;
      this.instalmentEnd.push({ value: month, text: `${month} เดือน(${i} ปี)` });
    }

    this.model.promotionalPrice = 0;
    this.model.deposit = 0;
    this.model.depositPrice = 0;
    this.model.instalmentEnd = 3;
    this.model.dueDate = 5;
    this.model.firstPayment = moment().format('YYYY-MM-DD');
    this.model.instalmentPrice = 0;
    this.model.interest = 2;
    this.model.nowVat = 7;
    this.model.remain = 0;
    this.model.sellTypeId = 4;
    this.model.sellAcitvityId = 25;
    this.model.irr = 0;
  }

  onChangeDeposit() {
    // เงินดาวน์ (บาท)
    // มูลค่าสินค้า * เงินดาวน์(%)
    this.model.depositPrice = this.model.netPrice * (this.model.deposit / 100);
    console.log(this.model.depositPrice);
  }

  onChangeDepositPrice() {
    // เงินดาวน์ (%)
    // เงินดาวน์ * 100 / มูลค่าสินค้า
    this.model.deposit = (this.model.depositPrice * 100) / this.model.netPrice;
    console.log(this.model.deposit);
  }

  instalmentCalculate() {
    // ยอดจัด = ราคารถ-เงินดาวน์
    // ดอกเบี้ย = (ยอดจัด*(อัตราดอกเบี้ย/100))*((จำนวนเดือนผ่อนชำระ))
    this.model.remain = this.model.netPrice - this.model.depositPrice;

    // ผ่อนชำระต่องวด = (((ราคารถ-เงินดาวน์)+(((ราคารถ-เงินดาวน์)*(อัตราดอกเบี้ย/100))*(จำนวนเดือนผ่อนชำระ/12)))/จำนวนเดือนผ่อนชำระ)
    this.model.instalmentPrice = (this.model.remain + (this.model.remain * (this.model.interest / 100)) *
      (this.model.instalmentEnd / 12)) / this.model.instalmentEnd;

    this._calcService.changeData(this.model);

  }

  onSubmit() {

  }

}
