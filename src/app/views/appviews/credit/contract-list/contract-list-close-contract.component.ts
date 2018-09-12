import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ContractService } from 'app/services/credit';
import { Router } from '@angular/router';
import { PageloaderService } from '../../pageloader/pageloader.component';
import { ContractListModel } from 'app/models/credit';
import { setLocalDate } from 'app/app.config';

import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';

@Component({
  selector: 'app-contract-list-close-contract',
  templateUrl: './contract-list-close-contract.component.html'
})
export class ContractListCloseContractComponent implements OnInit {
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
    await this.contractService.GetCloseContract().subscribe(o => {

      o.map(item => {
        item.contractDate = setLocalDate(item.contractDate);
      })

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

  gotoEditContract(contractId: number) {
    this.router.navigate(['credit/contract'], { queryParams: { mode: 'edit', contractId: contractId } });
  }

  gotoDetail(contractId: number) {
    this.router.navigate(['credit/detail'], { queryParams: { contractId: contractId } })
  }

}
