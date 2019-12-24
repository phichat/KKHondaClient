import { Component, OnInit } from '@angular/core';
import { ReceiveH, ReceiveD, LoadingEntities } from './pss-stock-receive.interface';
import { PssStockReceiveService } from './pss-stock-receive.service';
import { tap } from 'rxjs/operators';
import * as $ from 'jquery';
import { setLocalDate } from 'app/app.config';

@Component({
  selector: 'app-pss-stock-receive-list',
  templateUrl: './pss-stock-receive-list.component.html',
  styleUrls: ['./pss-stock-receive-list.component.scss']
})
export class PssStockReceiveListComponent implements OnInit {

  constructor(
    private s_service: PssStockReceiveService,
  ) { }

  displayLocalDate = setLocalDate;
  dataTable: any;
  LoadingEnt = LoadingEntities;
  loading: number;
  list: ReceiveH[] = [];

  ngOnInit() {
    this.s_service.receive_list()
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
