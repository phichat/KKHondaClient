import { Component, OnInit } from '@angular/core';
import { ReceiveH, ReceiveD, LoadingEntities } from './pss-save-po.interface';
import { PssSavePoService } from './pss-save-po.service';
import { tap } from 'rxjs/operators';
import * as $ from 'jquery';
import { setLocalDate } from 'app/app.config';

@Component({
  selector: 'app-pss-save-po-list',
  templateUrl: './pss-save-po-list.component.html',
  styleUrls: ['./pss-save-po-list.component.scss']
})
export class PssSavePoListComponent implements OnInit {

  constructor(
    private s_service: PssSavePoService,
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
