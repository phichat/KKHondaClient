import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CalculateModel, ContractModel } from '../../../../models/credit';
import { BookingService } from '../../../../services/selling';
import { UserService } from '../../../../services/users';
import * as moment from 'moment';
import { CalculateService } from '../../../../services/credit';
import { ContractItemComponent } from '../contract-item/contract-item.component';
// import * as $ from 'jquery';
import * as Inputmask from 'inputmask';
import { PageloaderService } from '../../pageloader/pageloader.component';
import { MyDatePickerOptions, setDateMyDatepicker, getDateMyDatepicker, resetLocalDate, setZero, setZeroHours, currencyToFloat } from '../../../../app.config';
import { IMyDateModel } from 'mydatepicker-th';

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
    myDatePickerOptions = MyDatePickerOptions;

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
                    this.model.createBy = u.id;
                    this.contractModel.branchId = u.branch;
                    this.contractModel.bookingId = p.bookingId;
                    this.contractModel.createBy = u.id;
                    this.contractModel.contractStatus = 32; // สัญญาใหม่
                    this.model.typePayment = '0';
                    this.model.deposit = 0;
                    this.model.depositPrice = 0;
                    this.model.dueDate = 5;
                    this.model.firstPayment = setDateMyDatepicker(new Date());
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
                // this.model.netPrice = p.outStandingPrice;
                this.model.nowVat = p.vat;
                this.instalmentCalculate();
                this._bookingService.changeData(p);
            });
    }

    onChangeDueDate(event: IMyDateModel) {
        this.model.firstPayment = event;
        this.instalmentCalculate();
    }

    async onLoadCaculateData(calculateId: number) {
        this.pageloader.setShowPageloader(true);
        await this._calcService.GetById(calculateId.toString())
            .subscribe(p => {
                const firstPayment = p.creditCalculate.firstPayment;
                this.model = p.creditCalculate;
                this.model.firstPayment = setDateMyDatepicker(new Date(firstPayment));
                this.model.typePayment = this.model.typePayment.toString();
                this.contractModel = p.creditContract;
                this.contractItemModel = p.creditContractItem;

                this.bookingNo = p.booking.bookingNo;
                this._bookingService.changeData(p.booking);
                // this._calcService.changeData(this.model)
            })
        this.pageloader.setShowPageloader(false);
    }
    onChangeDeposit() {
        // เงินดาวน์ (บาท)
        // มูลค่าสินค้า * เงินดาวน์(%)
        this.model.depositPrice = Math.ceil(this.model.outStandingPrice * (this.model.deposit / 100));
    }

    onChangeDepositPrice() {
        // เงินดาวน์ (%)
        // เงินดาวน์ * 100 / มูลค่าสินค้า
        let deposit: number = currencyToFloat(this.model.depositPrice.toString());
        this.model.deposit = ((deposit * 100) / this.model.outStandingPrice);
    }

    instalmentCalculate() {
        // ราคาสินค้าคงเหลือ
        let deposit: number = currencyToFloat(this.model.depositPrice.toString());
        this.model.netPrice = (this.model.outStandingPrice - deposit);

        // จำนวนดอกเบี้ยที่ต้องชำระ
        this.model.interestPrice = ((this.model.netPrice * (this.model.interest / 100)) * this.model.instalmentEnd);

        // จำนวนค่าเช่าซื้อที่ต้องผ่อนชำระทั้งสิ้น 
        this.model.remain = this.model.netPrice + this.model.interestPrice;

        // จำนวนค่าเช่าซื้อที่ต้องผ่อนชำระในแต่ละงวด
        const interestP = this.model.remain / this.model.instalmentEnd;
        this.model.instalmentPrice = this.ceil10(interestP);

        // จำนวนค่าภาษีมูลค่าเพิ่ม
        this.model.vatPrice = (this.model.instalmentPrice * this.model.nowVat) / (this.model.nowVat + 100);

        // ค่าเช่าซื้อต่องวดก่อนรวมภาษี
        this.model.instalmentPriceExtVat = this.model.instalmentPrice - this.model.vatPrice;

        // คำนวณ RATE
        this.model.irr = (this.RATE(this.model.instalmentEnd, -(this.model.instalmentPrice), this.model.netPrice) * 100);

        // คำนวนอัตราดอกเบี้ยที่แท้จริงต่อปี
        this.model.mrr = this.model.irr * this.model.instalmentEnd;

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

    async onSubmit() {
        this.pageloader.setShowPageloader(true);

        const firstPayment = getDateMyDatepicker(this.model.firstPayment);
        this.model.firstPayment = setZeroHours(firstPayment);
        this.contractItem.contractItemModel.map(item => {
            item.dueDate = resetLocalDate(item.dueDate);
        })

        if (this.mode === 'create') {
           await this.onCreate();

        } else if (this.mode === 'edit') {
           await this.onEdit();

        } else if (this.mode === 'revice') {
           await this.onRevice();
        }

        this.pageloader.setShowPageloader(false);

    }

    async onCreate() {
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
    }

    async onEdit() {
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
    }

    async onRevice() {
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
    }

}


