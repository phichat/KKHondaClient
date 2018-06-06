import { Component, OnInit, OnChanges, DoCheck, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SellActivityModel } from 'app/models/sell-activity';
import { CalculateInterface } from 'app/interfaces/credit';
import { CalculateModel, ContractItemModel } from 'app/models/credit';
import { BookingModel, BookingItemModel } from 'app/models/selling';
import { BookingService } from '../../../../services/selling';
import { UserService } from '../../../../services/users';
import * as moment from 'moment';
import { CalculateService } from '../../../../services/credit';
import { ContractItemComponent } from '../contract-item/contract-item.component';
import { ExDetailCustomerComponent } from '../ex-detail-customer/ex-detail-customer.component';
import { ExDetailMotobikeComponent } from '../ex-detail-motobike/ex-detail-motobike.component';
import { ExDetailAccessoryComponent } from '../ex-detail-accessory/ex-detail-accessory.component';
import { Finance } from 'financejs';


// import * as $ from 'jquery';
declare var $: any;
declare var toastr: any;
// declare var finance: any;

@Component({
    selector: 'app-calculate',
    templateUrl: './calculate.component.html',
    styleUrls: ['./calculate.component.scss']
})
export class CalculateComponent implements OnInit {

    @ViewChild(ContractItemComponent) contractItem;

    // finance: any;
    model = new CalculateModel();
    bookingNo: string;

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
        this.model.instalmentEnd = 3;
        this.model.dueDate = 5;
        this.model.firstPayment = moment().format('YYYY-MM-DD');
        this.model.instalmentPrice = 0;
        this.model.interest = 2;
        this.model.nowVat = 7;
        this.model.remain = 0;
        this.model.sellTypeId = 4;
        this.model.sellAcitvityId = 25;
        // this.model.irr = 0;

    }

    onLoadBooking(bookingId: number) {
        this._bookingService.getById(bookingId.toString())
            .subscribe(p => {
                this.bookingNo = p.bookingNo;
                this.model.netPrice = p.outStandingPrice;
                this.instalmentCalculate();
                this._bookingService.changeData(p);
            });
    }

    onChangeDeposit() {
        // เงินดาวน์ (บาท)
        // มูลค่าสินค้า * เงินดาวน์(%)
        this.model.depositPrice = this.model.netPrice * (this.model.deposit / 100);
    }

    onChangeDepositPrice() {
        // เงินดาวน์ (%)
        // เงินดาวน์ * 100 / มูลค่าสินค้า
        this.model.deposit = (this.model.depositPrice * 100) / this.model.netPrice;
    }

    instalmentCalculate() {

        // const priceExVat = this.model.
        // ยอดจัด = ราคารถ-เงินดาวน์
        // ดอกเบี้ย = (ยอดจัด*(อัตราดอกเบี้ย/100))*((จำนวนเดือนผ่อนชำระ))
        this.model.remain = this.model.netPrice - this.model.depositPrice;

        // ผ่อนชำระต่องวด = (((ราคารถ-เงินดาวน์)+(((ราคารถ-เงินดาวน์)*(อัตราดอกเบี้ย/100))*(จำนวนเดือนผ่อนชำระ/12)))/จำนวนเดือนผ่อนชำระ)
        this.model.instalmentPrice =
            (
                this.model.remain + (
                    this.model.remain * (
                        this.model.interest / 100
                    )
                ) * (
                    this.model.instalmentEnd
                )
            ) / this.model.instalmentEnd;

        const finance: any = new Finance();
        // console.log(finance.IRR(-4272.50, 70093.46, 24));
        // console.log(this.rate( 24, -3583.05, 64482) * 100);
        (this.rate(this.model.instalmentEnd, -this.model.instalmentPrice, this.model.netPrice) * 100).toFixed(2);

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
        this._calcService
            .Add(this.model, this.contractItem.contractItemModel)
            .subscribe(
                res => {
                    this.router.navigate(['credit/contract'], { queryParams: { contractId: res.contractId } });
                },
                (err: HttpErrorResponse) => {
                    toastr.error(err.statusText);
                }
            )
    }

}


