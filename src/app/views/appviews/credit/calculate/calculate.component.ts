import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, EventEmitter, ElementRef, DoCheck, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalculateModel, ContractModel } from '../../../../models/credit';
import { BookingService } from '../../../../services/selling';
import { UserService } from '../../../../services/users';
import { CalculateService } from '../../../../services/credit';
import { ContractItemComponent } from '../contract-item/contract-item.component';
import * as Inputmask from 'inputmask';
import { MyDatePickerOptions, setDateMyDatepicker, getDateMyDatepicker, setZeroHours, currencyToFloat, setLocalDate } from '../../../../app.config';
import { IMyDateModel } from 'mydatepicker-th';
import { distinctUntilChanged, debounceTime, switchMap, tap } from 'rxjs/operators';
import { DropdownTemplate } from 'app/models/drop-down-model';
import { ModelUser } from '../../../../models/users';
import { BookingModel } from 'app/models/selling';
import { message } from 'app/app.message';

declare var toastr: any;

@Component({
    selector: 'app-calculate',
    templateUrl: './calculate.component.html',
    styleUrls: ['./calculate.component.scss']
})
export class CalculateComponent implements OnInit, OnDestroy, AfterViewInit {
    ngAfterViewInit(): void {
        // const selector = document.querySelectorAll('input.number');
        // const number2Digit = document.querySelectorAll('input.number-2-digit');

        // Inputmask({
        //     'alias': 'numeric',
        //     'groupSeparator': ',',
        //     'autoGroup': true,
        //     'digits': 0,
        //     'digitsOptional': false
        // }).mask(selector);

        // Inputmask({
        //     'alias': 'numeric',
        //     'groupSeparator': ',',
        //     'autoGroup': true,
        //     'digits': 2
        // }).mask(number2Digit);
    }

    @ViewChild(ContractItemComponent) contractItem;
    @ViewChild('tempDueDate') tempDueDate: ElementRef;

    outStandingPriceState = 0;
    bookDepositState = 0;

    model: CalculateModel = new CalculateModel();
    contractModel: ContractModel = new ContractModel();
    contractItemModel = new Array<ContractModel>();
    userModel = new ModelUser();
    bookingNo: string;
    mode: string;
    myDatePickerOptions = MyDatePickerOptions;

    engineTypeahead = new EventEmitter<string>();
    engineDropdown: Array<DropdownTemplate> = new Array<DropdownTemplate>();

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
        // private pageloader: PageloaderService,
        private chRef: ChangeDetectorRef
    ) {
        toastr.options = {
            'closeButton': true,
            'progressBar': true,
        }
    }

    ngOnInit() {

        this._activatedRoute.queryParams.subscribe(async p => {

            this.mode = p.mode;

            if (p.mode === 'edit' && p.calculateId) {
                await this.onLoadCaculateData(p.calculateId);

            } else if (p.mode === 'revice' && p.calculateId) {
                await this.onLoadCaculateData(p.calculateId);

            } else if (p.mode === 'create' && p.bookingId) {
                this.model.bookingId = p.bookingId;
                await this.onLoadBooking(p.bookingId);

                this.contractModel.bookingId = p.bookingId;
                this.contractModel.contractStatus = 32; // สัญญาใหม่
                this.model.typePayment = '0';
                this.model.deposit = 0;
                this.model.depositPrice = 0;
                this.model.bookDeposit = 0;
                // this.model.dueDate = 5;
                this.model.firstPayment = setDateMyDatepicker(new Date());
                this.model.interest = 0;
                this.model.remain = 0;
                this.model.sellTypeId = 4;
                this.model.sellAcitvityId = 25;
                this.model.returnDeposit = '1';
                this.model.returnDepositPrice = 0;

                this._userService.currentData
                    .subscribe(u => {
                        this.chRef.markForCheck();
                        if (u) {
                            this.userModel = u;
                            this.model.createBy = u.id;
                            this.contractModel.branchId = u.branch;
                            this.contractModel.createBy = u.id;
                        }
                    });
            }
            this.searchEngine();
        });
    }

    // ngDoCheck(): void {
    //     const selector = document.querySelectorAll('input.number');
    //     const number2Digit = document.querySelectorAll('input.number-2-digit')

    //     Inputmask({
    //         'alias': 'numeric',
    //         'groupSeparator': ',',
    //         'autoGroup': true,
    //         'digits': 0,
    //         'digitsOptional': false
    //     }).mask(selector);

    //     Inputmask({
    //         'alias': 'numeric',
    //         'groupSeparator': ',',
    //         'autoGroup': true,
    //         'digits': 2
    //     }).mask(number2Digit);
    // }

    ngOnDestroy(): void {

    }

    selectItemEnging(e: any) {
        this.model.engineNo = e ? e.engineNo : null;
        this.model.frameNo = e ? e.frameNo : null;
    }

    searchEngineLoading = false;
    searchEngineLoadingTxt = '';
    searchEngine() {
        this.engineTypeahead.pipe(
            tap(() => {
                this.searchEngineLoading = true;
                this.searchEngineLoadingTxt = 'รอสักครู่...'
            }),
            distinctUntilChanged(),
            debounceTime(100),
            switchMap(term => this._calcService.GetEngineByKeyword(this.model.bookingId.toString(), this.userModel.branch.toString(), term))
        ).subscribe(x => {
            this.chRef.markForCheck();
            this.searchEngineLoading = false;
            this.searchEngineLoadingTxt = '';
            this.engineDropdown = x;
            this.engineDropdown.map(item => {
                item.text = `หมายเลขเครื่อง: ${item.engineNo}, หมายเลขตัวถัง: ${item.frameNo}`;
                item.value = item.logId.toString();
            })
        }, () => {
            this.searchEngineLoading = false;
            this.searchEngineLoadingTxt = '';
            this.engineDropdown = new Array<DropdownTemplate>();
        });
    }

    onLoadBooking(bookingId: number) {
        this._bookingService.getById(bookingId.toString())
            .subscribe(res => {
                const p = <BookingModel>res.json();

                this.outStandingPriceState = p.outStandingPrice;

                this.bookingNo = p.bookingNo;
                this.model.outStandingPrice = p.outStandingPrice;
                this.model.bookingPaymentType = p.bookingPaymentType;

                this.model.bookDeposit = p.deposit;
                this.bookDepositState = p.deposit;
                if (this.model.returnDeposit == '0') {
                    this.model.returnDepositPrice = p.deposit;
                    this.model.depositPrice = p.deposit;
                    this.onChangeDepositPrice();
                } else {
                    this.model.netPrice = (p.outStandingPrice + p.deposit);
                }

                this.model.nowVat = p.vat;
                this.instalmentCalculate();
                this._bookingService.changeData(p);
            });
    }

    onChangeDueDate(event: IMyDateModel) {
        this.model.firstPayment = event;
        this.instalmentCalculate();
    }

    onLoadCaculateData(calculateId: number) {
        this._calcService.GetById(calculateId.toString())
            .subscribe(p => {

                const firstPayment = p.creditCalculate.firstPayment;
                this.model = p.creditCalculate;
                this.model.firstPayment = setDateMyDatepicker(new Date(firstPayment));
                this.model.typePayment = this.model.typePayment.toString();
                this.contractModel = p.creditContract;
                this.contractItemModel = p.creditContractItem;

                this.bookingNo = p.booking.bookingNo;
                this._bookingService.changeData(p.booking);
                this._calcService.changeData(this.model);
            })
    }

    onChangeDeposit() {
        // เงินดาวน์ (บาท)
        // มูลค่าสินค้า * เงินดาวน์(%)
        this.model.depositPrice = Math.ceil(this.model.outStandingPrice * (this.model.deposit / 100));
    }

    onChangeDepositPrice() {
        // เงินดาวน์ (%)
        // เงินดาวน์ * 100 / มูลค่าสินค้า
        this.model.deposit = ((currencyToFloat(this.model.depositPrice.toString()) * 100) / this.model.outStandingPrice);
    }

    onReturnDeposit() {
        const depositPrice = currencyToFloat(this.model.depositPrice.toString());
        // คืนเงินมัดจำ
        switch (this.model.returnDeposit) {
            case '1':
                // ถ้าคืนเงิน
                // หักเงินจองออกจากเงินดาวน์
                if (depositPrice >= 0 && depositPrice >= this.bookDepositState)
                    this.model.depositPrice = depositPrice - this.bookDepositState;
                // เพิ่มเงินจองเข้าไปในราคาสินค้า
                // this.model.outStandingPrice = this.outStandingPriceState + this.bookDepositState;
                // ราคาสินค้าคงเหลือ
                this.model.netPrice = (this.outStandingPriceState + this.bookDepositState) - this.model.depositPrice;
                break;

            case '0':
                // ถ้าใช้เป็นเงินดาวน์
                // รีเซ็ต ราคาสินค้า
                this.model.outStandingPrice = this.outStandingPriceState;
                // เพิ่มเงินจองเข้าไปในเงินดาวน์
                this.model.depositPrice = depositPrice + this.bookDepositState;
                // ราคาสินค้าคงเหลือ
                this.model.netPrice = (this.model.outStandingPrice - depositPrice);
                break;
        }
        this.onChangeDepositPrice();
        this.instalmentCalculate();
    }

    instalmentCalculate() {
        // const deposit: number = currencyToFloat(this.model.depositPrice.toString());
        // this.model.netPrice = (this.model.outStandingPrice - deposit);

        const __instalmentEnd = parseInt((this.model.instalmentEnd || 0 as any).toString());
        const __interest = this.model.interest || 0;

        if (this.model.bookingPaymentType == 4 && this.model.instalmentEnd != undefined) {
            let firstPay = new Date(getDateMyDatepicker(this.model.firstPayment));
            firstPay.setDate(firstPay.getDate() + __instalmentEnd);
            this.tempDueDate.nativeElement.value = setLocalDate(firstPay.toISOString());
        }

        // จำนวนดอกเบี้ยที่ต้องชำระ
        if (this.model.typePayment == '0') {
            // รูปแบบการชำระ รายงวด
            this.model.interestPrice = ((this.model.netPrice * (__interest / 100)) * __instalmentEnd);

        } else if (this.model.typePayment == '1') {
            // รูปแบบการชำระ รายปี
            this.model.interestPrice = ((this.model.netPrice * (__interest / 100)) * (__instalmentEnd * 12));
        }

        // จำนวนค่าเช่าซื้อที่ต้องผ่อนชำระทั้งสิ้น 
        this.model.remain = (this.model.netPrice + this.model.interestPrice);

        // จำนวนค่าเช่าซื้อที่ต้องผ่อนชำระในแต่ละงวด
        const interestP = this.model.bookingPaymentType != 4
            ? this.model.remain / __instalmentEnd
            : this.model.remain;
        this.model.instalmentPrice = this.ceil10(interestP);

        // จำนวนค่าภาษีมูลค่าเพิ่ม
        this.model.vatPrice = (this.model.instalmentPrice * this.model.nowVat) / (this.model.nowVat + 100);

        // ค่าเช่าซื้อต่องวดก่อนรวมภาษี
        this.model.instalmentPriceExtVat = this.model.instalmentPrice - this.model.vatPrice;

        // คำนวณ RATE
        this.model.irr = (this.RATE(__instalmentEnd, -(this.model.instalmentPrice), this.model.netPrice) * 100);

        // คำนวนอัตราดอกเบี้ยที่แท้จริงต่อปี
        this.model.mrr = this.model.irr * __instalmentEnd;

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

    async onSubmit(f: any) {
        let form = this.model;
        const firstPayment = getDateMyDatepicker(form.firstPayment);
        form.firstPayment = setZeroHours(firstPayment);

        if (this.mode === 'create') {
            await this.onCreate(form);

        } else if (this.mode === 'edit') {
            await this.onEdit(form);

        } else if (this.mode === 'revice') {
            await this.onRevice(form);
        }
    }

    async onCreate(form: any) {
        await this._calcService
            .Create(form, this.contractModel, this.contractItem.contractItemModel)
            .subscribe(
                res => {
                    const x = res.json();
                    this.router.navigate(['credit/contract'], { queryParams: { mode: 'create', contractId: x.contractId } });
                },
                () => {
                    toastr.error(message.error);
                }
            );
    }

    async onEdit(form: any) {
        await this._calcService
            .Edit(form, this.contractModel, this.contractItem.contractItemModel)
            .subscribe(
                () => {
                    this.router.navigate(['credit/contract-list/active']);
                },
                () => {
                    toastr.error(message.error);
                }
            );
    }

    async onRevice(form: any) {
        await this._calcService
            .Revice(form, this.contractModel, this.contractItem.contractItemModel)
            .subscribe(
                () => {
                    this.router.navigate(['credit/contract-list/active']);
                },
                () => {
                    toastr.error(message.error);
                }
            );
    }

}

// Number.prototype.format = function(n, x) {
//     var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
//     return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
// };
interface Number {
    padZero(length: number);
}

