import { FormGroup, FormArray } from '@angular/forms';
import { ExpensesTag } from 'app/entities/ris.entities';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { ICarRegisReceiveDeposit } from 'app/interfaces/ris';
import { IUserResCookie } from 'app/interfaces/users';
import { LoadingEntities } from 'app/entities/loading.entities';
import { setLocalDate } from 'app/app.config';

export class ReceiveDepositConfig {
  formGroup: FormGroup;
  $ = $;
  EXPTag = ExpensesTag;
  LoadingEntities = LoadingEntities;
  displayLocalDate = setLocalDate;
  dataTable: any;
  mUser: IUserResCookie;

  get ConList(): FormArray {
    return this.formGroup.get('conList') as FormArray;
  }

  get ConListIsSelect(): any[] {
    return this.ConList.value.filter(x => x.IS_CHECKED);
  }

  get price1Summary(): number {
    const o = this.ConListIsSelect as ICarRegisReceiveDeposit[];
    return o.reduce((a, c) => a += c.netPrice1, 0);
  }

  get expenseSummary(): number {
    const o = this.ConListIsSelect as ICarRegisReceiveDeposit[];
    return o.reduce((a, c) => a += c.expense, 0);
  }

  get total(): number {
    return this.price1Summary + this.expenseSummary;
  }


  // initDatatable(): void {
  //   let table: any = $('table.set-dataTable');
  //   this.dataTable = table.DataTable({
  //     scrollX: true,
  //     // scrollY: '50vh',
  //     // scrollCollapse: true,
  //     // paging: false
  //   });
  // }

  // reInitDatatable(): void {
  //   this.destroyDatatable()
  //   setTimeout(() => this.initDatatable(), 0)
  // }

  destroyDatatable() {
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }
  }
}