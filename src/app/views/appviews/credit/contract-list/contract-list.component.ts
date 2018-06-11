import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ContractService } from '../../../../services/credit';
import { ContractListModel } from '../../../../models/credit';
import { Router } from '@angular/router';

import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';

@Component({
    selector: 'app-contract-list',
    templateUrl: './contract-list.component.html',
    styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {

    contractListModel: ContractListModel[];
    dataTable: any;

    constructor(
        private contractService: ContractService,
        private chRef: ChangeDetectorRef,
        private router: Router
    ) { }

    ngOnInit() {
        this.contractService.Get().subscribe(o => {

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

}
