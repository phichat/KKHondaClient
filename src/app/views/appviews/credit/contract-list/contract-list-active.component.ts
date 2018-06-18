import { Component, OnInit, ChangeDetectorRef, NgModule } from '@angular/core';
import { ContractService } from '../../../../services/credit';
import { Router } from '@angular/router';
import { ContractListModel } from '../../../../models/credit';

import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';

@Component({
    selector: 'app-contract-list-active',
    templateUrl: './contract-list-active.component.html'
})
export class ContractListActiveComponent implements OnInit {

    contractListModel: ContractListModel[];
    dataTable: any;

    constructor(
        private contractService: ContractService,
        private chRef: ChangeDetectorRef,
        private router: Router
    ) { }

    ngOnInit() {
        this.contractService.GetActive().subscribe(o => {

            // this.chRef.markForCheck();

            this.contractListModel = o;

            this.chRef.detectChanges();

            const table: any = $('table');
            this.dataTable = table.DataTable({
                'scrollX': true,
                'scrollY': true
            });

        });

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

    gotoCanceled(contractId: number) {
        this.router.navigate(['credit/canceled'], { queryParams: { contractId: contractId } })
    }

    gotoDetail(contractId: number) {
        this.router.navigate(['credit/detail'], { queryParams: { contractId: contractId } })
    }
}

