import { FormGroup, FormArray } from '@angular/forms';
import { ExpensesTag } from 'app/entities/ris.entities';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { ICarRegisClDeposit } from 'app/interfaces/ris';
import { IUserResCookie } from 'app/interfaces/users';
import { LoadingEntities } from 'app/entities/loading.entities';
import { setLocalDate } from 'app/app.config';
import { PaymentTypeList, PaymentType } from 'app/entities/general.entities';

export class ReceiveDepositConfig {
  formGroup: FormGroup;
  $ = $;
  EXPTag = ExpensesTag;
  LoadingEntities = LoadingEntities;
  displayLocalDate = setLocalDate;
  PaymentTypeList = PaymentTypeList;
  PaymentType = PaymentType;
  dataTable: any;
  mUser: IUserResCookie;
  checkedAll: boolean;
  loading: number;

  get ConList(): FormArray {
    return this.formGroup.get('conList') as FormArray;
  }

  get ConListIsSelect(): any[] {
    return this.ConList.value.filter(x => x.IS_CHECKED);
  }

  get price1Summary(): number {
    const o = this.ConListIsSelect as ICarRegisClDeposit[];
    return o.reduce((a, c) => a += c.netPrice1, 0);
  }

  get expenseSummary(): number {
    const o = this.ConListIsSelect as ICarRegisClDeposit[];
    return o.reduce((a, c) => a += c.expense, 0);
  }

  get total(): number {
    return this.price1Summary + this.expenseSummary;
  }

  initDatatable(): void {
    let table: any = this.$('table.set-dataTable');
    this.dataTable = table.DataTable({
      scrollY: '50vh',
      scrollCollapse: true,
      paging: false,
      searching: false,
      ordering: false,
      info: false
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