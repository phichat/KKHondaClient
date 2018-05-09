import { Component, OnInit, Input, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { SellActivityService, SellingService, BookingService, CreditService } from '../../../services/selling';
import { SellActivity, ModelCredit, Booking } from '../../../models/selling';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/users';
import { error } from 'util';

@Component({
   selector: 'app-credit',
   templateUrl: './credit.component.html',
   styleUrls: ['./credit.component.scss']
})
export class CreditComponent implements OnInit {

<<<<<<< HEAD
   model = new ModelCredit();
   modelBooking = new Booking();
   path: string;
   modelSellActivity = new Array<SellActivity>();
   sellType = [
      { value: 3, text: 'ลิสซิ่ง' },
      { value: 4, text: 'เช่าซื้อ' }]

   instalmentEnd = [
      { value: 3, text: '3 เดือน' },
      { value: 6, text: '6 เดือน' },
      { value: 9, text: '9 เดือน' }
   ];

   constructor(
      private _activatedRoute: ActivatedRoute,
      private _sellActivityService: SellActivityService,
      private _sellingService: SellingService,
      private _bookingService: BookingService,
      private _creditService: CreditService,
      private _userService: UserService
   ) {

   }

   ngOnInit() {
      this._activatedRoute.queryParams.subscribe(p => {
         if (p.bookingId) {
            this.model.bookingId = p.bookingId;
            this.onLoadBooking(p.bookingId);
         }
=======
  model = new ModelCredit();
  modelBooking = new Booking();
  path: string;
  modelSellActivity = new Array<SellActivity>();
  sellType = [
    { value: 3, text: 'ลิสซิ่ง' },
    { value: 4, text: 'เช่าซื้อ' }]

  instalmentEnd = [
    { value: 3, text: '3 เดือน' },
    { value: 6, text: '6 เดือน' },
    { value: 9, text: '9 เดือน' }
  ];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _sellActivityService: SellActivityService,
    private _sellingService: SellingService,
    private _bookingService: BookingService,
    private _creditService: CreditService,
    private _userService: UserService
  ) {

  }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(p => {
      if (p.bookingId) {
        this.model.bookingId = p.bookingId;
        this.onLoadBooking(p.bookingId);
      }
    });

    this._userService.currentData.subscribe(p => {
      this.model.createBy = p.userId;
    })

    for (let i = 1; i < 7; i++) {
      const month = i * 12;
      this.instalmentEnd.push({ value: month, text: `${month} เดือน(${i} ปี)` });
    }
    this.model.deposit = 0;
    this.model.depositPrice = 0;
    this.model.dueDate = (new Date).getDate();
    this.model.firstPayment = moment().format('YYYY-MM-DD');
    this.model.instalmentEnd = null;
    this.model.instalmentPrice = 0;
    this.model.interest = 0;
    this.model.nowVat = 7;
    this.model.remain = 0;
    this.model.sellType = 4;

    this.onChangeSellActivity();

  }

  onLoadBooking(bookingId: number) {
    this._bookingService.getById(bookingId.toString())
      .subscribe(p => {
        p.map(pp => {
          this.modelBooking = pp;
          this.model.netPrice = pp.netPrice;
        });
>>>>>>> 1cfe311cba8259b0d6e977288b9ccaad117a06cb
      });

      this._userService.currentData.subscribe(p => {
         this.model.createBy = p.userId;
      })

<<<<<<< HEAD
      for (let i = 1; i < 7; i++) {
         const month = i * 12;
         this.instalmentEnd.push({ value: month, text: `${month} เดือน(${i} ปี)` });
      }
      this.model.deposit = 0;
      this.model.depositPrice = 0;
      this.model.dueDate = (new Date).getDate();
      this.model.firstPayment = moment().format('YYYY-MM-DD');
      this.model.instalmentEnd = null;
      this.model.instalmentPrice = 0;
      this.model.interest = 0;
      this.model.nowVat = 7;
      this.model.remain = 0;
      this.model.sellType = 4;

      this.onChangeSellActivity();
   }

   onLoadBooking(bookingId: number) {
      this._bookingService.getById(bookingId.toString())
         .subscribe(p => {
            p.map(pp => {
               this.modelBooking = pp
               this.model.netPrice = pp.netPrice;
            });
         });

   }

   onChangeSellActivity() {
      this._sellActivityService
         .filterByKey(this.model.sellType.toString())
         .subscribe(p => {
            this.modelSellActivity = p;
            if (this.model.sellType === 4) {
               this.model.sellAcitvityId = 25;
            } else {
               this.model.sellAcitvityId = null;
            }
         });

   }

   onChangeDeposit() {
      // เงินดาวน์ (บาท)
      // มูลค่าสินค้า * เงินดาวน์(%)
      this.model.depositPrice = this.modelBooking.netPrice * (this.model.deposit / 100);
   }

   onChangeDepositPrice() {
      // เงินดาวน์ (%)
      // เงินดาวน์ * 100 / มูลค่าสินค้า
      this.model.deposit = (this.model.depositPrice * 100) / this.modelBooking.netPrice;
   }

   instalmentCalculate() {
      if (!this.modelBooking) {
         return false;
      }
      // คงเหลือ/ยอดจัด
      // มูลค่าสินค้า - เงินดาวน์(บาท)
      this.model.remain = this.modelBooking.netPrice - this.model.depositPrice;

      // ค่างวด
      // (ยอดคงเหลือ / จำนวนงวด) * (ดอกเบี้ยต่อปี (% --> บาท))
      this.model.instalmentPrice = (this.model.remain / this.model.instalmentEnd) * (1 + (this.model.interest / 100))
   }

   onSubmit() {
      console.log(this.model);
      this._creditService.insert(this.model).subscribe((p: Response) => console.log(p));
   }
=======
  }

  onChangeDeposit() {
    // เงินดาวน์ (บาท)
    // มูลค่าสินค้า * เงินดาวน์(%)
    this.model.depositPrice = this.modelBooking.netPrice * (this.model.deposit / 100);
  }

  onChangeDepositPrice() {
    // เงินดาวน์ (%)
    // เงินดาวน์ * 100 / มูลค่าสินค้า
    this.model.deposit = (this.model.depositPrice * 100) / this.modelBooking.netPrice;
  }

  instalmentCalculate() {
    if (!this.modelBooking) {
      return false;
    }
    // คงเหลือ/ยอดจัด
    // มูลค่าสินค้า - เงินดาวน์(บาท)
    this.model.remain = this.modelBooking.netPrice - this.model.depositPrice;

    // ค่างวด
    // (ยอดคงเหลือ / จำนวนงวด) * (ดอกเบี้ยต่อปี (% --> บาท))
    this.model.instalmentPrice = (this.model.remain / this.model.instalmentEnd) * (1 + (this.model.interest / 100))
  }

  onSubmit() {
    this._creditService.insert(this.model).subscribe(
      p => {console.log(p)},
      er => {console.error(er)}
    );
  }
>>>>>>> 1cfe311cba8259b0d6e977288b9ccaad117a06cb

}
