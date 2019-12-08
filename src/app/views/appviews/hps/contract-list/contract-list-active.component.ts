import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ContractService } from '../../../../services/credit';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { setLocalDate } from '../../../../app.config';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MStatusService, ZoneService, ContractGroupService, ContractTypeService } from 'app/services/masters';
import { LoaderService } from 'app/core/loader/loader.service';
import { UserService } from 'app/services/users';
import { combineLatest } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { ISpContractHps } from 'app/interfaces/credit';
import { DropDownModel } from 'app/models/drop-down-model';
import { message } from 'app/app.message';
declare var toastr: any;

@Component({
    selector: 'app-contract-list-active',
    templateUrl: './contract-list-active.component.html'
})
export class ContractListActiveComponent implements OnInit {

    contractListModel: ISpContractHps[];
    dataTable: any;
    formSearch: FormGroup;
    setLocalDate = setLocalDate;

    hpsDropdown: DropDownModel[];
    zoneDropdown: DropDownModel[];
    groupDropdown: DropDownModel[];
    typeDropdown: DropDownModel[];

    constructor(
        private s_contract: ContractService,
        private chRef: ChangeDetectorRef,
        private s_loader: LoaderService,
        private s_user: UserService,
        private router: Router,
        private fb: FormBuilder,
        private s_mStatus: MStatusService,
        private s_zone: ZoneService,
        private s_contractGroup: ContractGroupService,
        private s_contractType: ContractTypeService

    ) {
        toastr.options = {
            'closeButton': true,
            'progressBar': true,
        }
        const user = this.s_user.cookies;
        this.formSearch = this.fb.group({
            branchId: new FormControl(user.branchId, Validators.required),
            status: new FormControl(''),
            contractNo: new FormControl(''),
            contractDate: new FormControl(''),
            hireName: new FormControl(''),
            hireIdCard: new FormControl(''),
            eNo: new FormControl(''),
            fNo: new FormControl(''),
            contractGroup: new FormControl(''),
            contractType: new FormControl(''),
            contractPoint: new FormControl('')
        });
    }

    async ngOnInit() {
        this.s_loader.showLoader();
        const api1 = this.s_mStatus.HPSDropdown();
        const api2 = this.s_zone.DropDown();
        const api3 = this.s_contractGroup.DropDown();
        const api4 = this.s_contractType.DropDown();
        let form = this.formSearch.getRawValue();
        form = { ...form, status: 31 }
        const api5 = this.s_contract.SearchContract(form);
        const observe = combineLatest(api1, api2, api3, api4, api5).pipe(
            map(x => {
                return {
                    hpsDropdown: x[0],
                    zoneDropdown: x[1],
                    groupDropdown: x[2],
                    typeDropdown: x[3],
                    contractList: x[4]
                }
            })
        );

        observe.pipe(
            finalize(() => this.s_loader.onEnd())
        ).subscribe((x) => {
            this.hpsDropdown = x.hpsDropdown;
            this.zoneDropdown = x.zoneDropdown;
            this.groupDropdown = x.groupDropdown;
            this.typeDropdown = x.typeDropdown;
            this.contractListModel = x.contractList;
            this.reInitDatatable();
        }, () => toastr.error(message.failed));
    }

    onSearch() {
        const form = this.formSearch.getRawValue();
        this.s_contract.SearchContract(form).subscribe(x => {
            this.contractListModel = x;
            this.reInitDatatable();
        }, () => toastr.error(message.failed));
    }

    public initDatatable(): void {
        let table: any = $('table.set-dataTable');
        this.dataTable = table.DataTable({
            "scrollX": true
        });
    }

    public reInitDatatable(): void {
        this.destroyDatatable()
        setTimeout(() => this.initDatatable(), 0)
    }

    public destroyDatatable() {
        if (this.dataTable) {
            this.dataTable.destroy();
            this.dataTable = null;
        }
    }

    gotoEditCalculate(calculateId: number) {
        this.router.navigate(['credit/calculate'], { queryParams: { mode: 'edit', calculateId: calculateId } })
    }

    gotoReviceCalculate(calculateId: number) {
        this.router.navigate(['credit/calculate'], { queryParams: { mode: 'revice', calculateId: calculateId } })
    }

    gotoCreateContract(contractId: number) {
        this.router.navigate(['credit/contract'], { queryParams: { mode: 'create', contractId: contractId } });
    }

    gotoEditContract(contractId: number) {
        this.router.navigate(['credit/contract'], { queryParams: { mode: 'edit', contractId: contractId } });
    }

    gotoPayment(contractId: number) {
        this.router.navigate(['credit/payment', contractId]);
    }

    gotoCanceled(contractId: number) {
        this.router.navigate(['credit/contract-canceled'], { queryParams: { contractId: contractId } })
    }

    gotoDetail(contractId: number) {
        this.router.navigate(['credit/detail'], { queryParams: { contractId: contractId } })
    }
}

