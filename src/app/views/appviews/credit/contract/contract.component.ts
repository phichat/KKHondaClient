import { Component, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CalculateModel, ContractModel } from '../../../../models/credit';
import { UserService } from '../../../../services/users';
import * as moment from 'moment';
import { CalculateService, ContractService, ContractItemService } from '../../../../services/credit';
import { ActivatedRoute } from '@angular/router';
import { UserDropdownModel } from '../../../../models/users/user-dropdown-model';
import { CustomerDropdownModel } from '../../../../models/customers';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'
import { CustomerService } from '../../../../services/customers';
import { Observable } from 'rxjs/Observable';
import { concat } from 'rxjs/observable/concat';
import { BookingService } from '../../../../services/selling';

@Component({
    selector: 'app-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
    customerDropdown: CustomerDropdownModel[];
    customerTypeahead = new EventEmitter<string>();

    contractModel: ContractModel;
    contractItemModel = new Array<ContractModel>();
    calculateModel: CalculateModel;
    userDropdown = new Array<UserDropdownModel>();
    customerFullName: string;

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
        private _calcService: CalculateService,
        private _userService: UserService,
        private _contractService: ContractService,
        private _customerService: CustomerService,
        private _bookingService: BookingService,
        private _contractItemSerivce: ContractItemService,
        private chRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.searchCustomer();

        this._activatedRoute.queryParams.subscribe(p => {
            if (p.contractId) {
                this._contractService.getById(p.contractId).subscribe(o => {

                    // this.chRef.markForCheck();

                    this.userDropdown = o.userDropdown;
                    this.customerDropdown = o.customerDropdown;
                    this._bookingService.changeData(o.booking);
                    this.customerFullName = o.booking.custFullName;
                    this.contractModel = o.creditContract;
                    this.contractItemModel = o.creditContractItem;
                    this.calculateModel = o.creditCalculate;
                    this.calculateModel.firstPayment = moment(this.calculateModel.firstPayment).format('YYYY-MM-DD');
                });
            }
        });

        // this._userService.currentData.subscribe(p => {
        //     this.calculateModel.createBy = p.userId;
        // })

        for (let i = 1; i < 7; i++) {
            const month = i * 12;
            this.instalmentEnd.push({ value: month, text: `${month} เดือน(${i} ปี)` });
        }
    }

    onChangeDeposit() {
        // เงินดาวน์ (บาท)
        // มูลค่าสินค้า * เงินดาวน์(%)
        this.calculateModel.depositPrice = this.calculateModel.netPrice * (this.calculateModel.deposit / 100);
    }

    onChangeDepositPrice() {
        // เงินดาวน์ (%)
        // เงินดาวน์ * 100 / มูลค่าสินค้า
        this.calculateModel.deposit = (this.calculateModel.depositPrice * 100) / this.calculateModel.netPrice;
    }

    instalmentCalculate() {
        // ยอดจัด = ราคารถ-เงินดาวน์
        // ดอกเบี้ย = (ยอดจัด*(อัตราดอกเบี้ย/100))*((จำนวนเดือนผ่อนชำระ))
        this.calculateModel.remain = this.calculateModel.netPrice - this.calculateModel.depositPrice;

        // ผ่อนชำระต่องวด = (((ราคารถ-เงินดาวน์)+(((ราคารถ-เงินดาวน์)*(อัตราดอกเบี้ย/100))*(จำนวนเดือนผ่อนชำระ/12)))/จำนวนเดือนผ่อนชำระ)
        this.calculateModel.instalmentPrice = (
            this.calculateModel.remain + (
                this.calculateModel.remain * (this.calculateModel.interest / 100)
            ) * (this.calculateModel.instalmentEnd / 12)
        ) / this.calculateModel.instalmentEnd;

        this._calcService.changeData(this.calculateModel);

    }

    searchCustomer() {
        this.customerTypeahead.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(term => this._customerService.getByKey(term))
        ).subscribe(x => {
            this.chRef.markForCheck();
            this.customerDropdown = x;
        }, (err) => {
            this.customerDropdown = new Array<CustomerDropdownModel>();
        });
    }

    onSubmit() {

    }

}
