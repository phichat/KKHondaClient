import { Component, OnInit, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CalculateModel, ContractModel, ContractItemModel } from '../../../../models/credit';
import { UserService } from '../../../../services/users';
import * as moment from 'moment';
import { CalculateService, ContractService, ContractItemService } from '../../../../services/credit';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'
import { CustomerService } from '../../../../services/customers';
import { BookingService } from '../../../../services/selling';
import { DropDownModel } from '../../../../models/drop-down-model';
import { HttpErrorResponse } from '@angular/common/http';


declare var toastr: any;

@Component({
    selector: 'app-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit, OnDestroy {
    customerTypeahead = new EventEmitter<string>();

    contractModel: ContractModel;
    contractItemModel: Array<ContractItemModel>;
    calculateModel: CalculateModel;
    customerFullName: string;
    userDropdown: Array<DropDownModel>;
    customerDropdown: Array<DropDownModel>;
    relationDropdown: Array<DropDownModel>;
    contractGroupDropdown: Array<DropDownModel>;
    contractTypeDropdown: Array<DropDownModel>;
    zoneDropdown: Array<DropDownModel>;
    branchDropdown: Array<DropDownModel>;

    mode: string;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _calcService: CalculateService,
        private _userService: UserService,
        private _contractService: ContractService,
        private _customerService: CustomerService,
        private _bookingService: BookingService,
        private chRef: ChangeDetectorRef,
        private router: Router
    ) {
        toastr.options = {
            'closeButton': true,
            'progressBar': true,
        }
    }

    ngOnInit() {
        this.searchCustomer();

        this._activatedRoute.queryParams.subscribe(p => {
            this.mode = p.mode;
            if (p.contractId) {
                this._contractService.getById(p.contractId).subscribe(o => {

                    this.userDropdown = o.userDropdown;
                    this.customerDropdown = o.customerDropdown;
                    this.relationDropdown = o.relationDropdown;
                    this.contractGroupDropdown = o.contractGroupDropdown;
                    this.contractTypeDropdown = o.contractTypeDropdown;
                    this.zoneDropdown = o.zoneDropdown;
                    this.branchDropdown = o.branchDropdown;

                    this.contractModel = o.creditContract;
                    this.contractModel.statusText = o.statusText;
                    this.contractModel.contractHire = o.booking.customerCode;

                    this.contractModel.contractGroup = this.checkNullAndReturnStr(o.creditContract.contractGroup);
                    this.contractModel.contractType = this.checkNullAndReturnStr(o.creditContract.contractType);
                    this.contractModel.areaPayment = this.checkNullAndReturnStr(o.creditContract.areaPayment);
                    this.contractModel.contractPoint = this.checkNullAndReturnStr(o.creditContract.contractPoint);

                    this.contractModel.contractGroup = this.checkNullAndReturnStr(o.creditContract.contractGroup);
                    this.contractModel.contractType = this.checkNullAndReturnStr(o.creditContract.contractType);
                    this.contractModel.contractPoint = this.checkNullAndReturnStr(o.creditContract.contractPoint);
                    this.contractModel.createdBy = this.checkNullAndReturnStr(o.creditContract.createdBy);
                    this.contractModel.checkedBy = this.checkNullAndReturnStr(o.creditContract.checkedBy);
                    this.contractModel.approvedBy = this.checkNullAndReturnStr(o.creditContract.approvedBy);
                    this.contractModel.keeperBy = this.checkNullAndReturnStr(o.creditContract.keeperBy);

                    this._bookingService.changeData(o.booking);
                    this.customerFullName = o.booking.custFullName;
                    this.contractItemModel = o.creditContractItem;
                    this.calculateModel = o.creditCalculate;

                    if (p.mode === 'create') {
                        this.contractModel.contractDate = (o.creditContract.contractDate == null && moment().format('YYYY-MM-DD'));
                    } else {
                        this.contractModel.contractDate = moment(this.contractModel.contractDate).format('YYYY-MM-DD');
                    }
                });
            }
        });
    }

    ngOnDestroy() {
    }

    checkNullAndReturnStr(int: any) {
        return int !== null && int.toString();
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
            this.customerDropdown = new Array<DropDownModel>();
        });
    }

    onSubmit() {

        if (this.mode === 'create') {
            this._contractService.Create(this.contractModel).subscribe(
                res => {
                    this.router.navigate(['credit/contract-list']);
                },
                (err: HttpErrorResponse) => {
                    toastr.error(err.statusText);
                }
            );
        } else if (this.mode === 'edit') {
            this._contractService.Edit(this.contractModel).subscribe(
                res => {
                    this.router.navigate(['credit/contract-list']);
                },
                (err: HttpErrorResponse) => {
                    toastr.error(err.statusText);
                }
            );
        }


    }

}
