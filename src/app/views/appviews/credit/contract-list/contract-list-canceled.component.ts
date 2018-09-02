import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { ContractListModel } from '../../../../models/credit';
import { ContractService } from '../../../../services/credit';
import { setLocalDate } from '../../../../app.config';

@Component({
    selector: 'app-contract-list-canceled',
    templateUrl: './contract-list-canceled.component.html'
})
export class ContractListCanceledComponent implements OnInit {

    contractListModel: ContractListModel[];
    dataTable: any;

    constructor(
        private contractService: ContractService,
        private chRef: ChangeDetectorRef,
        private router: Router
    ) { }

    ngOnInit() {
        this.contractService.GetCanceled().subscribe(o => {

            // this.chRef.markForCheck();
            this.contractListModel = o;
            this.contractListModel.map(item => {
                item.contractDate = setLocalDate(item.contractDate);
            })

            this.chRef.detectChanges();

            const table: any = $('table');
            this.dataTable = table.DataTable({
                'scrollX': true,
                'scrollY': true
            });

        });
    }

    gotoDetail(contractId: number) {
        this.router.navigate(['credit/detail'], { queryParams: { contractId: contractId } })
    }

}
