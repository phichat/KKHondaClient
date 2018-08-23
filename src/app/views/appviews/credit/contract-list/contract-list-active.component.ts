import { Component, OnInit, ChangeDetectorRef, NgModule } from '@angular/core';
import { ContractService } from '../../../../services/credit';
import { Router } from '@angular/router';
import { ContractListModel } from '../../../../models/credit';

import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { PageloaderService } from '../../pageloader/pageloader.component';

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
        private router: Router,
        private pageloader: PageloaderService
    ) { }

    async ngOnInit() {
        this.pageloader.setShowPageloader(true);
        await this.contractService.GetActive().subscribe(o => {
            this.contractListModel = o;

            this.chRef.detectChanges();

            const table: any = $('table');
            this.dataTable = table.DataTable({
                'scrollX': true,
                'scrollY': true
            });

        });
        this.pageloader.setShowPageloader(false);
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
        this.router.navigate(['credit/canceled'], { queryParams: { contractId: contractId } })
    }

    gotoDetail(contractId: number) {
        this.router.navigate(['credit/detail'], { queryParams: { contractId: contractId } })
    }
}

