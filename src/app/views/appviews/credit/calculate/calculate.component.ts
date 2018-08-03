import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CalculateModel, ContractModel } from 'app/models/credit';
import { BookingService } from '../../../../services/selling';
import { UserService } from '../../../../services/users';
import * as moment from 'moment';
import { CalculateService } from '../../../../services/credit';
import { ContractItemComponent } from '../contract-item/contract-item.component';
import * as $ from 'jquery';
import * as Inputmask from 'inputmask';
import { PageloaderService } from '../../pageloader/pageloader.component';

declare var toastr: any;

@Component({
    selector: 'app-calculate',
    templateUrl: './calculate.component.html',
    styleUrls: ['./calculate.component.scss']
})
export class CalculateComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(ContractItemComponent) contractItem;

    model: CalculateModel = new CalculateModel();
    contractModel: ContractModel = new ContractModel();
    contractItemModel = new Array<ContractModel>();
    bookingNo: string;
    mode: string;

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
        private pageloader: PageloaderService
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
                    this.model.typePayment = '0';
                    this.model.deposit = 0;
                    this.model.depositPrice = 0;
                    this.model.dueDate = 5;
                    this.model.firstPayment = moment().format('YYYY-MM-DD');
                    this.model.interest = 2;
                    this.model.remain = 0;
                    this.model.sellTypeId = 4;
                    this.model.sellAcitvityId = 25;
                });
            }
        });
    }

    ngAfterViewInit() {

        const selector = document.querySelectorAll('input.number');
        const number2Digit = document.querySelectorAll('input.number-2-digit')

        Inputmask({
            'alias': 'numeric',
            'groupSeparator': ',',
            'autoGroup': true,
            'digits': 0,
            'digitsOptional': false
        }).mask(selector);

        Inputmask({
            'alias': 'numeric',
            'groupSeparator': ',',
            'autoGroup': true,
            'digits': 2
        }).mask(number2Digit);
    }

    ngOnDestroy(): void {

    }

    onLoadBooking(bookingId: number) {
        this._bookingService.getById(bookingId.toString())
            .subscribe(p => {
                this.bookingNo = p.bookingNo;
                this.model.outStandingPrice = p.outStandingPrice;
                this.model.netPrice = p.outStandingPrice;
                this.model.nowVat = p.vat;
                this.instalmentCalculate();
                this._bookingService.changeData(p);
            });
    }

    async onLoadCaculateData(calculateId: number) {
        this.pageloader.setShowPageloader(true);
        await this._calcService.GetById(calculateId.toString())
            .subscribe(p => {
                this.model = p.creditCalculate;
                this.contractModel = p.creditContract;
                this.contractItemModel = p.creditContractItem;
                this.model.firstPayment = moment(p.firstPayment).format('YYYY-MM-DD');
                this.model.typePayment = this.model.typePayment.toString();

                this.bookingNo = p.booking.bookingNo;
                this._bookingService.changeData(p.booking);
            })
        this.pageloader.setShowPageloader(false);
    }

    onChangeDeposit() {
        // เงินดาวน์ (บาท)
        // มูลค่าสินค้า * เงินดาวน์(%)
        // this.model.netPrice
        this.model.depositPrice = Math.ceil(this.model.netPrice * (this.model.deposit / 100));
    }

    onChangeDepositPrice() {
        // เงินดาวน์ (%)
        // เงินดาวน์ * 100 / มูลค่าสินค้า
        // this.model.netPrice
        this.model.deposit = ((this.model.depositPrice * 100) / this.model.netPrice);
    }

    instalmentCalculate() {
        // ยอดจัด = ราคารถ-เงินดาวน์
        // ราคาดอกเบี้ย = (ราคารถ*(อัตราดอกเบี้ย/100))*((จำนวนเดือนผ่อนชำระ))
        // this.model.netPrice
        this.model.interestPrice = (this.model.netPrice * (this.model.interest / 100)) * this.model.instalmentEnd;
        // ราคารถรวมดอกเบี้ย
        // this.model.netPrice
        const netPrice = (this.model.netPrice + this.model.interestPrice);
        this.model.outStandingPrice = netPrice;
        // ยอดจัด = (ราคารถรวมดอกเบี้ย - เงินดาวน์)        
        this.model.remain = Math.ceil(netPrice - this.model.depositPrice);
        // ผ่อนชำระต่องวด = ยอดจัด / จำนวนเดือนผ่อนชำระ
        this.model.instalmentPrice = (this.model.remain / this.model.instalmentEnd);

        const vatUp = 1 + (this.model.nowVat / 100);

        // เงินดาวน์
        const depositExcVat = this.model.depositPrice / vatUp;
        // ราคาสินค้า(ไม่รวมดอกเบี้ย) - เงินดาวน์ 
        // this.model.netPrice
        const netPriceExcVat = (this.model.netPrice / vatUp) - depositExcVat;
        // ค่างวดต่อเดือน(รวมดอกเบี้ย)
        const instalmentPriceExcVat = this.model.instalmentPrice / vatUp;
        // คำนวณ RATE
        this.model.irr = (this.RATE(this.model.instalmentEnd, -(instalmentPriceExcVat), netPriceExcVat) * 100);
        this._calcService.changeData(this.model);
    }

    ceil10(int: number) {
        return (Math.ceil(int / 10) * 10);
    }

    RATE(nper, pmt, pv, fv?, type?, guess?) {
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

    async onCreate() {
        this.pageloader.setShowPageloader(true)
        await this._calcService
            .Create(this.model, this.contractModel, this.contractItem.contractItemModel)
            .subscribe(
                res => {
                    this.router.navigate(['credit/contract'], { queryParams: { mode: 'create', contractId: res.contractId } });
                },
                (err: HttpErrorResponse) => {
                    toastr.error(err.statusText);
                }
            );
        this.pageloader.setShowPageloader(false)
    }

    async onEdit() {
        this.pageloader.setShowPageloader(true)
        await this._calcService
            .Edit(this.model, this.contractModel, this.contractItem.contractItemModel)
            .subscribe(
                res => {
                    this.router.navigate(['credit/contract-list/active']);
                },
                (err: HttpErrorResponse) => {
                    toastr.error(err.statusText);
                }
            );
        this.pageloader.setShowPageloader(false)
    }

    async onRevice() {
        this.pageloader.setShowPageloader(true)
        await this._calcService
            .Revice(this.model, this.contractModel, this.contractItem.contractItemModel)
            .subscribe(
                res => {
                    this.router.navigate(['credit/contract-list/active']);
                },
                (err: HttpErrorResponse) => {
                    toastr.error(err.statusText);
                }
            );
        this.pageloader.setShowPageloader(false);
    }

}


