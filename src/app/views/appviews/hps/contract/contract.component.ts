import { Component, OnInit, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CalculateModel, ContractModel, ContractItemModel } from '../../../../models/credit';
import { UserService } from '../../../../services/users';
import { ContractService } from '../../../../services/credit';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, debounceTime, switchMap, tap } from 'rxjs/operators'
import { CustomerService } from '../../../../services/customers';
import { BookingService } from '../../../../services/selling';
import { DropDownModel } from '../../../../models/drop-down-model';
import { HttpErrorResponse } from '@angular/common/http';
import { setZeroHours, setLocalDate } from '../../../../app.config';
import { message } from 'app/app.message';
import { BookingModel } from 'app/models/selling';

declare var toastr: any;

@Component({
    selector: 'app-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit, OnDestroy {
    tempDueDate: string;

    contractMateTypeahead = new EventEmitter<string>();
    contractHireTypeahead = new EventEmitter<string>();
    contractGurantor1Typeahead = new EventEmitter<string>();
    contractGurantor2Typeahead = new EventEmitter<string>();

    contractModel: ContractModel = new ContractModel();
    contractItemModel: Array<ContractItemModel> = new Array<ContractItemModel>();
    calculateModel: CalculateModel = new CalculateModel();
    bookingModel: BookingModel = new BookingModel();
    customerFullName: string;
    userDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    contractMateDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    statusDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    contractHireDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    contractGurantor1Dropdown: Array<DropDownModel> = new Array<DropDownModel>();
    contractGurantor2Dropdown: Array<DropDownModel> = new Array<DropDownModel>();
    // relationDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    contractGroupDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    contractTypeDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    zoneDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    branchDropdown: Array<DropDownModel> = new Array<DropDownModel>();

    mode: string;

    statusDesc: string;

    constructor(
        private _activatedRoute: ActivatedRoute,
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
        this.searchContractMate();
        this.searchcontractHire();
        this.searchContractGurantor1();
        this.searchContractGurantor2();

        this._activatedRoute.queryParams.subscribe(async p => {
            this.mode = p.mode;
            if (p.contractId) {
                this._contractService.getById(p.contractId).subscribe(res => {
                    const o = res.json();
                    this.userDropdown = o.userDropdown;
                    // this.contractMateDropdown = o.contractMateDropdown;
                    // this.contractHireDropdown = o.contractHireDropdown;
                    // this.contractGurantor1Dropdown = o.contractGurantor1Dropdown;
                    // this.contractGurantor2Dropdown = o.contractGurantor2Dropdown;
                    // this.relationDropdown = o.relationDropdown;
                    this.contractGroupDropdown = o.contractGroupDropdown;
                    this.contractTypeDropdown = o.contractTypeDropdown;
                    this.statusDropdown = o.statusDropdown;
                    this.zoneDropdown = o.zoneDropdown;
                    this.branchDropdown = o.branchDropdown;

                    this.contractModel = o.creditContract;
                    this.contractModel.statusDesc = o.statusDesc;
                    // this.contractModel.contractHire = o.booking.customerCode;

                    this.contractModel.gurantorRelation1 = this.checkNullAndReturnStr(o.creditContract.gurantorRelation1);
                    this.contractModel.gurantorRelation2 = this.checkNullAndReturnStr(o.creditContract.gurantorRelation2);

                    this.contractModel.contractGroup = this.checkNullAndReturnStr(o.creditContract.contractGroup);
                    this.contractModel.contractType = this.checkNullAndReturnStr(o.creditContract.contractType);
                    this.contractModel.areaPayment = this.checkNullAndReturnStr(o.creditContract.areaPayment);
                    this.contractModel.contractPoint = this.checkNullAndReturnStr(o.creditContract.contractPoint);

                    this.contractModel.contractStatus = this.checkNullAndReturnStr(o.creditContract.contractStatus);

                    this.contractModel.contractGroup = this.checkNullAndReturnStr(o.creditContract.contractGroup);
                    this.contractModel.contractType = this.checkNullAndReturnStr(o.creditContract.contractType);
                    this.contractModel.contractPoint = this.checkNullAndReturnStr(o.creditContract.contractPoint);
                    this.contractModel.createdBy = this.checkNullAndReturnStr(o.creditContract.createdBy);
                    this.contractModel.checkedBy = this.checkNullAndReturnStr(o.creditContract.checkedBy);
                    this.contractModel.approvedBy = this.checkNullAndReturnStr(o.creditContract.approvedBy);
                    this.contractModel.keeperBy = this.checkNullAndReturnStr(o.creditContract.keeperBy);

                    this.contractModel.contractBooking = o.booking.custCode;
                    this.customerFullName = o.booking.custFullName;

                    this.bookingModel = o.booking;
                    this._bookingService.changeData(o.booking);
                    this.contractItemModel = o.creditContractItem;

                    if (this.bookingModel.bookingPaymentType == 4) {
                        let firstPay = new Date(o.creditCalculate.firstPayment);
                        firstPay.setDate(firstPay.getDate() + o.creditCalculate.instalmentEnd);
                        this.tempDueDate = setLocalDate(firstPay.toISOString());
                    }

                    o.creditCalculate.firstPayment = setLocalDate(o.creditCalculate.firstPayment);

                    this.calculateModel = o.creditCalculate;

                    if (p.mode === 'create') {
                        this.contractModel.contractDate = (o.creditContract.contractDate == null && new Date());
                        this._userService.currentData.subscribe(u => {
                            this.contractModel.createdBy = u.id.toString();
                            this.contractModel.checkedBy = u.id.toString();
                            this.contractModel.approvedBy = u.id.toString();
                            this.contractModel.keeperBy = u.id.toString();
                        })
                    } else {
                        this.contractModel.contractDate = new Date(this.contractModel.contractDate);
                        this._userService.currentData.subscribe(u => {
                            this.contractModel.updateBy = u.id.toString();
                        });
                    }
                });
            }
        });
    }

    ngOnDestroy() {
    }

    checkNullAndReturnStr(int: any) {
        return int !== null ? int.toString() : null;
    }

    contractMateLoading: boolean;
    contractMateLoadingTxt: string;
    searchContractMate() {
        this.contractMateTypeahead.pipe(
            tap(() => {
                this.contractMateLoading = true;
                this.contractMateLoadingTxt = message.loading;
            }),
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(term => this._customerService.getByKey(term))
        ).subscribe(x => {
            this.chRef.markForCheck();
            this.contractMateDropdown = x;
            this.contractMateUnload();
        }, () => {
            this.contractMateDropdown = new Array<DropDownModel>();
            this.contractMateUnload();
        });
    }
    contractMateUnload() {
        this.contractMateLoading = false;
        this.contractMateLoadingTxt = '';
    }

    contractHireLoading: boolean;
    contractHireLoadingTxt: string;
    searchcontractHire() {
        this.contractHireTypeahead.pipe(
            tap(() => {
                this.contractHireLoading = true;
                this.contractHireLoadingTxt = message.loading;
            }),
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(term => this._customerService.getByKey(term))
        ).subscribe(x => {
            this.chRef.markForCheck();
            this.contractHireDropdown = x;
            this.contractHireUnload();
        }, () => {
            this.contractHireUnload();
            this.contractHireDropdown = new Array<DropDownModel>();
        });
    }
    contractHireUnload() {
        this.contractHireLoading = false;
        this.contractHireLoadingTxt = '';
    }

    contractGurantor1Loading: boolean;
    contractGurantor1LoadingTxt: string;
    searchContractGurantor1() {
        this.contractGurantor1Typeahead.pipe(
            tap(() => {
                this.contractGurantor1Loading = true;
                this.contractGurantor1LoadingTxt = message.loading;
            }),
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(term => this._customerService.getByKey(term))
        ).subscribe(x => {
            this.chRef.markForCheck();
            this.contractGurantor1Dropdown = x;
            this.contractGurantor1Unload();
        }, () => {
            this.contractGurantor1Dropdown = new Array<DropDownModel>();
            this.contractGurantor1Unload();
        });
    }

    contractGurantor1Unload() {
        this.contractGurantor1Loading = false;
        this.contractGurantor1LoadingTxt = '';
    }
    contractGurantor2Loading: boolean;
    contractGurantor2LoadingTxt: string;
    searchContractGurantor2() {
        this.contractGurantor2Typeahead.pipe(
            tap(() => {
                this.contractGurantor2Loading = true;
                this.contractGurantor2LoadingTxt = message.loading;
            }),
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(term => this._customerService.getByKey(term))
        ).subscribe(x => {
            this.chRef.markForCheck();
            this.contractGurantor2Dropdown = x;
            this.contractGurantor2Unload();
        }, () => {
            this.contractGurantor2Dropdown = new Array<DropDownModel>();
            this.contractGurantor2Unload();
        });
    }
    contractGurantor2Unload() {
        this.contractGurantor2Loading = false;
        this.contractGurantor2LoadingTxt = '';
    }

    onSubmit() {
        // const contractDate = this.contractModel.contractDate;
        this.contractModel.contractDate = setZeroHours(this.contractModel.contractDate);

        if (this.mode === 'create') {
            this._contractService.Create(this.contractModel, this.bookingModel).subscribe(
                () => {
                    this.router.navigate(['credit/payment', this.contractModel.contractId]);
                },
                (err: HttpErrorResponse) => {
                    toastr.error(err.statusText);
                }
            );
        } else if (this.mode === 'edit') {
            this._contractService.Edit(this.contractModel, this.bookingModel).subscribe(
                () => {
                    this.router.navigate(['credit/contract-list/active']);
                },
                (err: HttpErrorResponse) => {
                    toastr.error(err.statusText);
                }
            );
        }
    }

    // onChangeContractDate(event: IMyDateModel) {
    //     this.contractModel.contractDate = event;
    // }
}
