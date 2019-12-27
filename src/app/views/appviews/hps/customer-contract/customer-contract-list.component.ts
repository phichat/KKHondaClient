import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DropDownModel } from '../../../../models/drop-down-model';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { MyDatePickerOptions } from '../../../../app.config';
import { Router } from '@angular/router';
import { ContractCustomerListModel } from 'app/models/credit/contract-customer-model';
import { ContractCustomerService } from 'app/services/credit/contract-customer.service';

@Component({
  selector: 'app-customer-contract-list.component',
  templateUrl: 'customer-contract-list.component.html'
})

export class CustomerContractListComponent implements OnInit {

  branchDropDown: DropDownModel[];
  datas: ContractCustomerListModel[];
  dataTable: any;

  myDatePickerOptions = MyDatePickerOptions;

  constructor(
    private s_contract: ContractCustomerService,
    private chRef: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit() {
    this.s_contract.GetCustomerContractList().subscribe(x => {
      this.datas = x
      this.reInitDatatable();
    })
  }

  onSubmit(value: any) {

  }

  onCreate() {
    this.router.navigate(['credit/customer-contract'], { queryParams: { mode: 'Create', code: 0 } });
  }

  onEdit(contractId: number) {
    this.router.navigate(['credit/customer-contract'], { queryParams: { mode: 'Edit', code: contractId } });
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

}