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


// import * as $ from 'jquery';
declare var $: any;
declare var toastr: any;

@Component({
    selector: 'app-calculate',
    templateUrl: './calculate.component.html',
    styleUrls: ['./calculate.component.scss']
})
export class CalculateComponent implements OnInit {

    @ViewChild(ContractItemComponent) contractItem;

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
        private _builder: FormBuilder,
        private router: Router,
        private chRef: ChangeDetectorRef,
    ) {
        toastr.options = {
            'closeButton': true,
            'progressBar': true,
        }
    }

    // // tslint:disable-next-line:member-ordering
    // Item: CalculateModel;
    // // tslint:disable-next-line:member-ordering
    // Form: FormGroup = this._builder.group({
    //     creditId: [null],
    //     bookingId: [null, Validators.required],
    //     netPrice: [null, Validators.required],
    //     deposit: [null, Validators.required],
    //     depositPrice: [null, Validators.required],
    //     instalmentEnd: [null, Validators.required],
    //     instalmentPrice: [null, Validators.required],
    //     interest: [null, Validators.required],
    //     remain: [null, Validators.required],
    //     firstPayment: [null, Validators.required],
    //     dueDate: [null, Validators.required],
    //     promotionalPrice: [0, Validators.required],
    //     nowVat: [null, Validators.minLength(0)]
    // });

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

        console.log(JSON.stringify(this.model));
        console.log(JSON.stringify(this.contractItem.contractItemModel));
        //    this._calcService
        //       .Add(this.model, this.contractItem.contractItemModel)
        //       .subscribe(
        //          res => {
        this.router.navigate(['credit/contract']);
        //          },
        //          (err: HttpErrorResponse) => {
        //             toastr.error(err.statusText);
        //          }
        //       )

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


