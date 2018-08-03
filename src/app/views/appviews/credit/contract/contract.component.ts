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
import { BookingModel } from '../../../../models/selling';
import { PageloaderService } from '../../pageloader/pageloader.component';


declare var toastr: any;

@Component({
    selector: 'app-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit, OnDestroy {
    contractMateTypeahead = new EventEmitter<string>();
    contractUserTypeahead = new EventEmitter<string>();
    contractGurantor1Typeahead = new EventEmitter<string>();
    contractGurantor2Typeahead = new EventEmitter<string>();

    contractModel: ContractModel = new ContractModel();
    contractItemModel: Array<ContractItemModel> = new Array<ContractItemModel>();
    calculateModel: CalculateModel = new CalculateModel();
    customerFullName: string;
    userDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    contractMateDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    contractUserDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    contractGurantor1Dropdown: Array<DropDownModel> = new Array<DropDownModel>();
    contractGurantor2Dropdown: Array<DropDownModel> = new Array<DropDownModel>();
    relationDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    contractGroupDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    contractTypeDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    zoneDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    branchDropdown: Array<DropDownModel> = new Array<DropDownModel>();
    statusDropdown: Array<DropDownModel> = new Array<DropDownModel>();

    mode: string;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _calcService: CalculateService,
        private _userService: UserService,
        private _contractService: ContractService,
        private _customerService: CustomerService,
        private _bookingService: BookingService,
        private chRef: ChangeDetectorRef,
        private router: Router,
        private pageloader: PageloaderService
    ) {
        toastr.options = {
            'closeButton': true,
            'progressBar': true,
        }
    }

    ngOnInit() {
        this.searchContractMate();
        this.searchContractUser();
        this.searchContractGurantor1();
        this.searchContractGurantor2();

        this._activatedRoute.queryParams.subscribe(async p => {
            this.mode = p.mode;
            if (p.contractId) {
                this.pageloader.setShowPageloader(true);
                await this._contractService.getById(p.contractId).subscribe(o => {

                    this.userDropdown = o.userDropdown;
                    this.contractMateDropdown = o.contractMateDropdown;
                    this.contractUserDropdown = o.contractUserDropdown;
                    this.contractGurantor1Dropdown = o.contractGurantor1Dropdown;
                    this.contractGurantor2Dropdown = o.contractGurantor2Dropdown;
                    this.relationDropdown = o.relationDropdown;
                    this.contractGroupDropdown = o.contractGroupDropdown;
                    this.contractTypeDropdown = o.contractTypeDropdown;
                    this.statusDropdown = o.statusDropdown;
                    this.zoneDropdown = o.zoneDropdown;
                    this.branchDropdown = o.branchDropdown;

                    this.contractModel = o.creditContract;
                    this.contractModel.statusDesc = o.statusDesc;
                    this.contractModel.contractHire = o.booking.customerCode;

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

                    this.contractModel.contractHire = o.booking.custCode;
                    this.customerFullName = o.booking.custFullName;

                    this._bookingService.changeData(o.booking);
                    this.contractItemModel = o.creditContractItem;
                    this.calculateModel = o.creditCalculate;

                    if (p.mode === 'create') {
                        this.contractModel.contractDate = (o.creditContract.contractDate == null && moment().format('YYYY-MM-DD'));
                    } else {
                        this.contractModel.contractDate = moment(this.contractModel.contractDate).format('YYYY-MM-DD');
                        this._userService.currentData.subscribe(u => {
                            this.contractModel.updateBy = u.userId;
                        });
                    }
                });
                this.pageloader.setShowPageloader(false);
            }
        });
    }

    ngOnDestroy() {
    }

    checkNullAndReturnStr(int: any) {
        return int !== null ? int.toString() : null;
    }

    searchContractMate() {
        this.contractMateTypeahead.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(term => this._customerService.getByKey(term))
        ).subscribe(x => {
            this.chRef.markForCheck();
            this.contractMateDropdown = x;
        }, (err) => {
            this.contractMateDropdown = new Array<DropDownModel>();
        });
    }

    searchContractUser() {
        this.contractUserTypeahead.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(term => this._customerService.getByKey(term))
        ).subscribe(x => {
            this.chRef.markForCheck();
            this.contractUserDropdown = x;
        }, (err) => {
            this.contractUserDropdown = new Array<DropDownModel>();
        });
    }

    searchContractGurantor1() {
        this.contractGurantor1Typeahead.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(term => this._customerService.getByKey(term))
        ).subscribe(x => {
            this.chRef.markForCheck();
            this.contractGurantor1Dropdown = x;
        }, (err) => {
            this.contractGurantor1Dropdown = new Array<DropDownModel>();
        });
    }

    searchContractGurantor2() {
        this.contractGurantor2Typeahead.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(term => this._customerService.getByKey(term))
        ).subscribe(x => {
            this.chRef.markForCheck();
            this.contractGurantor2Dropdown = x;
        }, (err) => {
            this.contractGurantor2Dropdown = new Array<DropDownModel>();
        });
    }

    async onSubmit() {
        this.pageloader.setShowPageloader(true)
        if (this.mode === 'create') {

            await this._contractService.Create(this.contractModel).subscribe(
                res => {
                    this.router.navigate(['credit/contract-list/active']);
                },
                (err: HttpErrorResponse) => {
                    toastr.error(err.statusText);
                }
            );
        } else if (this.mode === 'edit') {
            await this._contractService.Edit(this.contractModel).subscribe(
                res => {
                    this.router.navigate(['credit/contract-list/active']);
                },
                (err: HttpErrorResponse) => {
                    toastr.error(err.statusText);
                }
            );
        }
        this.pageloader.setShowPageloader(false);
    }

}
