import { Component, OnInit } from '@angular/core';
import { savePO_H, LoadingEntities } from './mcs-save-po.interface';
import { McsSavePoService } from './mcs-save-po.service';
import { tap } from 'rxjs/operators';
import * as $ from 'jquery';
import { setLocalDate } from 'app/app.config';

@Component({
  selector: 'app-mcs-save-po-list',
  templateUrl: './mcs-save-po-list.component.html',
  styleUrls: ['./mcs-save-po-list.component.scss']
})
export class McsSavePoListComponent implements OnInit {

  constructor(
    private s_McsSavePo: McsSavePoService,
  ) { }

  displayLocalDate = setLocalDate;
  dataTable: any;
  LoadingEnt = LoadingEntities;
  loading: number;
  list: savePO_H[] = [];

  ngOnInit() {
    this.s_McsSavePo.GetAll()
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
