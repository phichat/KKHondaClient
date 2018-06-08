import { Component, OnInit, OnChanges, DoCheck, ChangeDetectorRef, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SellActivityModel } from 'app/models/sell-activity';
import { CalculateInterface } from 'app/interfaces/credit';
import { CalculateModel, ContractItemModel, ContractModel } from 'app/models/credit';
import { BookingModel, BookingItemModel } from 'app/models/selling';
import { BookingService } from '../../../../services/selling';
import { UserService } from '../../../../services/users';
import * as moment from 'moment';
import { CalculateService } from '../../../../services/credit';
import { ContractItemComponent } from '../contract-item/contract-item.component';
import { ExDetailCustomerComponent } from '../ex-detail-customer/ex-detail-customer.component';
import { ExDetailMotobikeComponent } from '../ex-detail-motobike/ex-detail-motobike.component';
import { ExDetailAccessoryComponent } from '../ex-detail-accessory/ex-detail-accessory.component';


// import * as $ from 'jquery';
declare var $: any;
declare var toastr: any;
// declare var finance: any;

@Component({
    selector: 'app-calculate',
    templateUrl: './calculate.component.html',
    styleUrls: ['./calculate.component.scss']
})
export class CalculateComponent implements OnInit, OnDestroy {

    @ViewChild(ContractItemComponent) contractItem;

    model: CalculateModel = new CalculateModel();
    contractModel: ContractModel = new ContractModel();
    contractItemModel = new Array<ContractModel>();
    bookingNo: string;
    mode: string;

    // sellType = [
    //     { value: 3, text: 'ลิสซิ่ง' },
    //     { value: 4, text: 'เช่าซื้อ' }]

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
        private _activatedRoute: ActivatedRoute,
        private _bookingService: BookingService,
        private _calcService: CalculateService,
        private _userService: UserService,
        private router: Router,
        private chRef: ChangeDetectorRef
    ) {
        toastr.options = {
            'closeButton': true,
            'progressBar': true,
        }
    }

    ngOnInit() {
        for (let i = 1; i < 7; i++) {
            const month = i * 12;
            this.instalmentEnd.push({ value: month, text: `${month} เดือน(${i} ปี)` });
        }

        this._activatedRoute.queryParams.subscribe(p => {

            this.mode = p.mode;

            if (p.mode === 'edit' && p.calculateId) {
                this.onLoadCaculateData(p.calculateId);

            } else if (p.mode === 'revice' && p.calculateId) {
                this.onLoadCaculateData(p.calculateId);

            } else if (p.mode === 'create' && p.bookingId) {
                this.model.bookingId = p.bookingId;
                this.onLoadBooking(p.bookingId);
                this._userService.currentData.subscribe(u => {
                    this.model.createBy = u.userId;
                    this.contractModel.branchId = u.branchId;
                    this.contractModel.bookingId = p.bookingId;
                    this.contractModel.createBy = u.userId;
                    this.contractModel.contractStatus = 32; // สัญญาใหม่
                });

                this.model.promotionalPrice = 0;
                this.model.deposit = 0;
                this.model.depositPrice = 0;
                this.model.instalmentEnd = 3;
                this.model.dueDate = 5;
                this.model.firstPayment = moment().format('YYYY-MM-DD');
                this.model.interest = 2;
                this.model.remain = 0;
                this.model.sellTypeId = 4;
                this.model.sellAcitvityId = 25;
            }
        });
    }

    ngOnDestroy(): void {

    }

    onLoadBooking(bookingId: number) {
        this._bookingService.getById(bookingId.toString())
            .subscribe(p => {
                this.bookingNo = p.bookingNo;
                this.model.netPrice = p.outStandingPrice;
                this.model.outStandingPrice = p.outStandingPrice;
                this.model.nowVat = p.vat;
                this.instalmentCalculate();
                console.log(p);
                this._bookingService.changeData(p);
            });
    }

<<<<<<< HEAD
            this.chRef.detectChanges();

            this.instalmentCalculate();

            const accessory = $('table#accessory');
            accessory.footable();
         });

   }

   // onChangeSellActivity() {
   //    this._sellActivityService
   //       .filterByKey(this.model.sellTypeId.toString())
   //       .subscribe(p => {
   //          this.modelSellActivity = p;
   //          if (this.model.sellTypeId === 4) {
   //             this.model.sellAcitvityId = 25;
   //          } else {
   //             this.model.sellAcitvityId = null;
   //          }
   //       });
   // }

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

      this._calcService.changeMessage(this.model);

   }

   onSubmit() {
      if (this.Form.valid) {
      //    this._calcService
      //       .Add(this.model, this.contractItem.contractItemModel)
      //       .subscribe(
      //          res => {
                  this.router.navigate(['credit/contract']);
            //    },
            //    (err: HttpErrorResponse) => {
            //       toastr.error(err.statusText);
            //    }
            // )
         //    toastr.success('success');
         // console.log(JSON.stringify(this.model));
         // console.log(JSON.stringify(this.contractItem.contractItemModel));
         // this.router.navigate(['credit/contract']);
         // this._calcService.Add(this.model).subscribe(
         //    res => {
         //       this.router.navigate(['credit/contract']);
         //    },
         //    (err: HttpErrorResponse) => {
         //       toastr.error(err.statusText);
         //    }
         // );
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
=======
    onLoadCaculateData(calculateId: number) {
        this._calcService.GetById(calculateId.toString())
            .subscribe(p => {
                this.model = p.creditCalculate;
                this.contractModel = p.creditContract;
                this.contractItemModel = p.creditContractItem;
                this.model.firstPayment = moment(p.firstPayment).format('YYYY-MM-DD');
                this.bookingNo = p.booking.bookingNo;
                this._bookingService.changeData(p.booking);
            })
    }

    onChangeDeposit() {
        // เงินดาวน์ (บาท)
        // มูลค่าสินค้า * เงินดาวน์(%)
        this.model.depositPrice = (this.model.netPrice * (this.model.deposit / 100));
    }

    onChangeDepositPrice() {
        // เงินดาวน์ (%)
        // เงินดาวน์ * 100 / มูลค่าสินค้า
        this.model.deposit = ((this.model.depositPrice * 100) / this.model.netPrice);
    }

    instalmentCalculate() {

        // const priceExVat = this.model.
        // ยอดจัด = ราคารถ-เงินดาวน์
        // ดอกเบี้ย = (ยอดจัด*(อัตราดอกเบี้ย/100))*((จำนวนเดือนผ่อนชำระ))
        this.model.remain = this.model.netPrice - this.model.depositPrice;
        // this.model.instalmentRemain = this.model.remain;

        // ผ่อนชำระต่องวด = (((ราคารถ-เงินดาวน์)+(((ราคารถ-เงินดาวน์)*(อัตราดอกเบี้ย/100))*(จำนวนเดือนผ่อนชำระ)))/จำนวนเดือนผ่อนชำระ)
        const instalmentPrice = (
            this.model.remain + (
                this.model.remain * (
                    this.model.interest / 100
                )
            ) * (
                this.model.instalmentEnd
            )
        ) / this.model.instalmentEnd;

        this.model.instalmentPrice = instalmentPrice;

        const vatDown = (this.model.nowVat / 100);
        const vatUp = 1 + vatDown;

        // เงินดาวน์(ถอด vat)
        const depositExcVat = this.model.depositPrice / vatUp;
        // ราคาสินค้า(ถอด vat) - เงินดาวน์
        const netPriceExcVat = (this.model.netPrice / vatUp) - depositExcVat;
        // ค่างวดต่อเดือน(ถอด vat)
        const instalmentPriceExcVat = this.model.instalmentPrice / vatUp;
        // คำนวณ RATE
        this.model.irr = (this.rate(this.model.instalmentEnd, -(instalmentPriceExcVat), netPriceExcVat) * 100);

        this._calcService.changeData(this.model);
    }

    rate(nper, pmt, pv, fv?, type?, guess?) {
        // Sets default values for missing parameters
        fv = typeof fv !== 'undefined' ? fv : 0;
        type = typeof type !== 'undefined' ? type : 0;
        guess = typeof guess !== 'undefined' ? guess : 0.1;

        // Sets the limits for possible guesses to any
        // number between 0% and 100%
        let lowLimit = 0;
        let highLimit = 1;

        // Defines a tolerance of up to +/- 0.00005% of pmt, to accept
        // the solution as valid.
        const tolerance = Math.abs(0.00000005 * pmt);

        // Tries at most 40 times to find a solution within the tolerance.
        for (let i = 0; i < 40; i++) {
            // Resets the balance to the original pv.
            let balance = pv;

            // Calculates the balance at the end of the loan, based
            // on loan conditions.
            for (let j = 0; j < nper; j++) {
                if (type === 0) {
                    // Interests applied before payment
                    balance = balance * (1 + guess) + pmt;
                } else {
                    // Payments applied before insterests
                    balance = (balance + pmt) * (1 + guess);
                }
            }

            // Returns the guess if balance is within tolerance.  If not, adjusts
            // the limits and starts with a new guess.
            if (Math.abs(balance + fv) < tolerance) {
                return guess;
            } else if (balance + fv > 0) {
                // Sets a new highLimit knowing that
                // the current guess was too big.
                highLimit = guess;
            } else {
                // Sets a new lowLimit knowing that
                // the current guess was too small.
                lowLimit = guess;
            }

            // Calculates the new guess.
            guess = (highLimit + lowLimit) / 2;
        }

        // Returns null if no acceptable result was found after 40 tries.
        return null;
    };

    onSubmit() {
        if (this.mode === 'create') {
            this.onCreate();

        } else if (this.mode === 'edit') {
            this.onEdit();

        } else if (this.mode === 'revice') {
            this.onRevice();
        }

    }

    onCreate() {
        this._calcService
            .Create(this.model, this.contractModel, this.contractItem.contractItemModel)
            .subscribe(
                res => {
                    this.router.navigate(['credit/contract'], { queryParams: { mode: 'create', contractId: res.contractId } });
                },
                (err: HttpErrorResponse) => {
                    toastr.error(err.statusText);
                }
            );
    }

    onEdit() {
        this._calcService
            .Edit(this.model, this.contractModel, this.contractItem.contractItemModel)
            .subscribe(
                res => {
                    this.router.navigate(['credit/contract-list']);
                },
                (err: HttpErrorResponse) => {
                    toastr.error(err.statusText);
                }
            );
    }

    onRevice() {
        this._calcService
            .Revice(this.model, this.contractModel, this.contractItem.contractItemModel)
            .subscribe(
                res => {
                    this.router.navigate(['credit/contract-list']);
                },
                (err: HttpErrorResponse) => {
                    toastr.error(err.statusText);
                }
            );
    }
>>>>>>> 233c237c4ade93c1ab675beb9a27f74824fca27a

}


