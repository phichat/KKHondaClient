import { Component, OnInit } from '@angular/core';
import { ReceiveDepositService } from 'app/services/ris';
import { tap } from 'rxjs/operators';
import { LoaderService } from 'app/core/loader/loader.service';
import { IClDepositRes } from 'app/interfaces/ris';
import { LoadingEntities } from 'app/entities/loading.entities';
import * as $ from 'jquery';
import { setLocalDate, setZeroHours } from 'app/app.config';
import { ReceiveClStatus, ExpensesTag, ReceiveClStatusList, ExpensesTagList } from 'app/entities/ris.entities';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { PaymentTypeList } from 'app/entities/general.entities';

@Component({
  selector: 'app-receive-deposit-list',
  templateUrl: './receive-deposit-list.component.html',
  styleUrls: ['./receive-deposit-list.component.scss']
})
export class ReceiveDepositListComponent implements OnInit {

  constructor(
    private s_clDeposit: ReceiveDepositService,
    private fb: FormBuilder
  ) {
    this.formSearch = this.fb.group({
      receiptNo: new FormControl(null),
      paymentDate: new FormControl(null),
      expenseTag: this.fb.array([]),
      paymentType: this.fb.array([]),
      createName: new FormControl(null),
      status: new FormControl(null)
    });
  }

  dataTable: any;
  ExpTag = ExpensesTag;
  ExpTagList = ExpensesTagList.filter(x => x.id == this.ExpTag.EXP10003 || x.id == this.ExpTag.EXP10004);;
  LoadingEnt = LoadingEntities;
  loading: number;
  list: IClDepositRes[] = [];
  displayLocalDate = setLocalDate;
  ReceiveClStatus = ReceiveClStatus;
  ReceiveClStatusList = ReceiveClStatusList;
  PaymentTypeList = PaymentTypeList;
  formSearch: FormGroup;

  get expenseTag(): FormArray {
    return this.formSearch.get('expenseTag') as FormArray;
  }

  get paymentType(): FormArray {
    return this.formSearch.get('paymentType') as FormArray;
  }

  ngOnInit() {
    this.addCheckboxes(this.ExpTagList, this.expenseTag);
    this.addCheckboxes(this.PaymentTypeList, this.paymentType);
  }

  onSearch() {
    const expenseTag = (this.expenseTag.value as any[])
      .map((v, i) => v ? this.ExpTagList[i].id : null)
      .filter(v => v != null);

    const paymentType = (this.paymentType.value as any[])
      .map((v, i) => v ? this.PaymentTypeList[i].id : null)
      .filter(v => v != null);

    let form = { ...this.formSearch.value };
    form = {
      ...form,
      paymentDate: setZeroHours(form.paymentDate),
      expenseTag: expenseTag.length ? [...expenseTag] : [null],
      paymentType: paymentType.length ? [...paymentType] : [null]
    };

    this.loading = this.LoadingEnt.loading
    this.s_clDeposit.SearchClDepositList(form).subscribe(x => {
      if (!x.length) {
        this.loading = this.LoadingEnt.noRecord;
        return;
      }
      this.list = x;
      this.reInitDatatable();
    }, () => this.loading = this.LoadingEnt.error)
  }

  private addCheckboxes(itemList: any[], formArray: FormArray) {
    itemList.forEach((o, i) => {
      const control = new FormControl(null); // if first item set to true, else false
      formArray.push(control);
    });
  }

  initDatatable(): void {
    let table: any = $('table.set-dataTable');
    this.dataTable = table.DataTable({
      scrollX: true,
    });
  }

  reInitDatatable(): void {
    this.destroyDatatable()
    setTimeout(() => this.initDatatable(), 0)
  }

  destroyDatatable() {
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }
  }

}
