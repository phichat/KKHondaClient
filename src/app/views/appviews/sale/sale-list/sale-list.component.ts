import { Component, OnInit } from '@angular/core';
import { ContractService, SaleService } from '../../../../services/credit';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { setLocalDate } from '../../../../app.config';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MStatusService } from 'app/services/masters';
import { LoaderService } from 'app/core/loader/loader.service';
import { UserService } from 'app/services/users';
import { combineLatest } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { ISpSearchSale } from 'app/interfaces/credit';
import { DropDownModel } from 'app/models/drop-down-model';
import { message } from 'app/app.message';
import { BookingPaymentTypeList, BookingPaymentType } from 'app/entities/mcs.entities';
declare var toastr: any;

@Component({
    selector: 'app-sale-list',
    templateUrl: './sale-list.component.html'
})
export class SaleListComponent implements OnInit {

    contractListModel: ISpSearchSale[];
    dataTable: any;
    formSearch: FormGroup;
    setLocalDate = setLocalDate;
    BookingPaymentTypeList = BookingPaymentTypeList;
    BookingPaymentType = BookingPaymentType;

    hpsDropdown: DropDownModel[];

    constructor(
        private s_sale: SaleService,
        private s_loader: LoaderService,
        private s_user: UserService,
        private router: Router,
        private fb: FormBuilder,
        private s_mStatus: MStatusService,

    ) {
        toastr.options = {
            'closeButton': true,
            'progressBar': true,
        }
        const user = this.s_user.cookies;
        this.formSearch = this.fb.group({
            branchId: new FormControl(user.branchId, Validators.required),
            sellNo: new FormControl(''),
            sellDate: new FormControl(''),
            hireName: new FormControl(''),
            hireIdCard: new FormControl(''),
            eNo: new FormControl(''),
            fNo: new FormControl(''),
            bookingPaymentType: new FormControl('')
        });
    }

    ngOnInit() {
        this.s_loader.showLoader();
        let form = this.formSearch.getRawValue();
        form = { ...form, status: 31 }
        const api1 = this.s_mStatus.HPSDropdown();
        const api2 = this.s_sale.SearchSale(form);
        const observe = combineLatest(api1, api2).pipe(
            map(x => {
                return {
                    hpsDropdown: x[0],
                    contractList: x[1]
                }
            })
        );

        observe.pipe(
            finalize(() => this.s_loader.onEnd())
        ).subscribe((x) => {
            this.hpsDropdown = x.hpsDropdown;
            this.contractListModel = x.contractList;
            this.reInitDatatable();
        }, () => {
            toastr.error(message.error)
        });
    }

    onSearch() {
        const form = this.formSearch.getRawValue();
        this.s_sale.SearchSale(form).subscribe(x => {
            this.contractListModel = x;
            this.reInitDatatable();
        }, () => toastr.error(message.error));
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

    // gotoEditCalculate(calculateId: number) {
    //     this.router.navigate(['credit/calculate'], { queryParams: { mode: 'edit', calculateId: calculateId } })
    // }

    // gotoReviceCalculate(calculateId: number) {
    //     this.router.navigate(['credit/calculate'], { queryParams: { mode: 'revice', calculateId: calculateId } })
    // }

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

    gotoContractDetail(contractId: number) {
        this.router.navigate(['credit/detail'], { queryParams: { contractId: contractId } });
    }

    gotoDetail = (contractId: number, bookingId: number, saleId: number) =>
        this.router.navigate(['sale/sale-detail'], {
            queryParams: { contractId, bookingId, saleId }
        });

}

