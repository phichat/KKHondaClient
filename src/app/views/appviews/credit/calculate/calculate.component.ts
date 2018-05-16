import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SellActivityModel } from 'app/models/sell-activity';
import { CalculateInterface } from 'app/interfaces/credit';
import { CalculateModel } from 'app/models/credit';
import { BookingModel, BookingItemModel } from 'app/models/selling';
import { SellActivityService } from '../../../../services/sell-activity';
import { BookingService } from '../../../../services/selling';
import { UserService } from '../../../../services/users';
import * as moment from 'moment';

declare var toastr: any;
declare var jQuery: any;

@Component({
   selector: 'app-calculate',
   templateUrl: './calculate.component.html',
   styleUrls: ['./calculate.component.scss']
})
export class CalculateComponent implements CalculateInterface, OnInit, DoCheck {

   model = new CalculateModel();
   modelBooking = new BookingModel();
   modelAccessory = new Array<BookingItemModel>();
   modelMotobike = new BookingItemModel();

   path: string;
   modelSellActivity = new Array<SellActivityModel>();
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
      private _bookingService: BookingService,
      private _userService: UserService,
      private _builder: FormBuilder,
      private router: Router
   ) {
      toastr.options = {
         'closeButton': true,
         'progressBar': true,
      }
   }

   // tslint:disable-next-line:member-ordering
   Item: CalculateModel;
   // tslint:disable-next-line:member-ordering
   Form: FormGroup = this._builder.group({
      creditId: [null],
      bookingId: [null, Validators.required],
      netPrice: [null, Validators.required],
      sellTypeId: [null, Validators.required],
      sellAcitvityId: [null, Validators.required],
      deposit: [null, Validators.required],
      depositPrice: [null, Validators.required],
      instalmentEnd: [null, Validators.required],
      instalmentPrice: [null, Validators.required],
      interest: [null, Validators.required],
      remain: [null, Validators.required],
      firstPayment: [null, Validators.required],
      dueDate: [null, Validators.required],
      promotionalPrice: [0, Validators.required],
      nowVat: [null, Validators.minLength(0)]
   });

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
      this.model.promotionalPrice = 0;
      this.model.deposit = 0;
      this.model.depositPrice = 0;
      this.model.dueDate = (new Date).getDate();
      this.model.firstPayment = moment().format('YYYY-MM-DD');
      this.model.instalmentEnd = null;
      this.model.instalmentPrice = 0;
      this.model.interest = 0;
      this.model.nowVat = 7;
      this.model.remain = 0;
      this.model.sellTypeId = 4;

      this.onChangeSellActivity();
   }

   ngDoCheck() {
      if (jQuery('table.footable tbody tr').length > 0 && jQuery('table.footable-loaded').length === 0) {
         jQuery('table').footable();
      }
   }

   onLoadBooking(bookingId: number) {
      this._bookingService.getById(bookingId.toString())
         .subscribe(p => {
            p.map(pp => {
               this.modelBooking = pp
               this.model.netPrice = pp.outStandingPrice;
               this.modelAccessory = pp.bookingItem.filter(i => i.catId !== 2 && i.catId !== 4 && i.catId !== 7);
               pp.bookingItem
                  .filter(i => i.catId === 2 || i.catId === 4 || i.catId === 7)
                  .map(i => this.modelMotobike = i);
            });
         });

   }

   onChangeSellActivity() {
      this._sellActivityService
         .filterByKey(this.model.sellTypeId.toString())
         .subscribe(p => {
            this.modelSellActivity = p;
            if (this.model.sellTypeId === 4) {
               this.model.sellAcitvityId = 25;
            } else {
               this.model.sellAcitvityId = null;
            }
         });

   }

   onChangeDeposit() {
      // เงินดาวน์ (บาท)
      // มูลค่าสินค้า * เงินดาวน์(%)
      this.model.depositPrice = this.modelBooking.outStandingPrice * (this.model.deposit / 100);
   }

   onChangeDepositPrice() {
      // เงินดาวน์ (%)
      // เงินดาวน์ * 100 / มูลค่าสินค้า
      this.model.deposit = (this.model.depositPrice * 100) / this.modelBooking.outStandingPrice;
   }

   instalmentCalculate() {
      if (!this.modelBooking) {
         return false;
      }
      // คงเหลือ/ยอดจัด
      // มูลค่าสินค้า - เงินดาวน์(บาท)
      this.model.remain = this.modelBooking.outStandingPrice - this.model.depositPrice;

      // ค่างวด
      // (ยอดคงเหลือ / จำนวนงวด) * (ดอกเบี้ยต่อปี (% --> บาท))
      this.model.instalmentPrice = (this.model.remain / this.model.instalmentEnd) * (1 + (this.model.interest / 100))
   }

   onSubmit() {
      if (this.Form.valid) {
         //    toastr.success('success');
         this.router.navigate(['credit/contract'])
      } else {
         toastr.error('กรุณาระบุข้อมูลให้ครบถ่วน!');
      }

      // this._creditService.insert(this.model).subscribe(
      //   (res: HttpErrorResponse) => {
      //     console.log(res.statusText);
      //   },
      //   (err: HttpErrorResponse) => {
      //     console.log(err.statusText);
      //   }
      // );
   }

}
