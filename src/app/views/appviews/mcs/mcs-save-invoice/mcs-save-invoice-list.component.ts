import { Component, OnInit } from '@angular/core';
import { ReceiveH, ReceiveD, LoadingEntities } from './mcs-save-invoice.interface';
import { McsSaveInvoiceService } from './mcs-save-invoice.service';
import { tap } from 'rxjs/operators';
import * as $ from 'jquery';
import { setLocalDate } from 'app/app.config';

@Component({
  selector: 'app-mcs-save-invoice-list',
  templateUrl: './mcs-save-invoice-list.component.html',
  styleUrls: ['./mcs-save-invoice-list.component.scss']
})
export class McsSaveInvoiceListComponent implements OnInit {

  constructor(
    private s_service: McsSaveInvoiceService,
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
