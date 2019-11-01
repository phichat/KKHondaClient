import { Component, OnInit } from '@angular/core';
import { ReceiveDepositService } from 'app/services/ris';
import { tap } from 'rxjs/operators';
import { LoaderService } from 'app/core/loader/loader.service';
import { IClDepositRes } from 'app/interfaces/ris';
import { LoadingEntities } from 'app/entities/loading.entities';
import * as $ from 'jquery';
import { setLocalDate } from 'app/app.config';
import { ReceiveClStatus, ExpensesTag } from 'app/entities/ris.entities';

@Component({
  selector: 'app-receive-deposit-list',
  templateUrl: './receive-deposit-list.component.html',
  styleUrls: ['./receive-deposit-list.component.scss']
})
export class ReceiveDepositListComponent implements OnInit {

  constructor(
    private s_clDeposit: ReceiveDepositService,
  ) { }

  dataTable: any;
  ExpTag = ExpensesTag;
  LoadingEnt = LoadingEntities;
  loading: number;
  list: IClDepositRes[] = [];
  displayLocalDate = setLocalDate;
  ReceiveClStatus = ReceiveClStatus

  ngOnInit() {
    this.s_clDeposit.GetAll()
      .pipe(
        tap(() => {
          this.loading = this.LoadingEnt.loading
        })
      )
      .subscribe(x => {
        if (!x.length) {
          this.loading = this.LoadingEnt.noRecord;
          return;
        }
        this.list = x;
        this.reInitDatatable();
      }, () => this.loading = this.LoadingEnt.error)
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
