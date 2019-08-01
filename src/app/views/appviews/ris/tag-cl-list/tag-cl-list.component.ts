import { Component, OnInit, OnDestroy } from '@angular/core';
import { appConfig } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { TagClListConfig } from './tag-cl-list.config';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';

@Component({
  selector: 'app-tag-cl-list',
  templateUrl: './tag-cl-list.component.html',
  styleUrls: ['./tag-cl-list.component.scss']
})
export class TagClListComponent extends TagClListConfig implements OnInit, OnDestroy {
  
  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit() {
    const sedList = `${appConfig.apiUrl}/Ris/Cl/All`;

    this.http.get(sedList).subscribe((x: any[]) => {
      if (!x.length) {
        this.loading = 1;
        return;
      };
      this.clList = x;

      // const res = x.reduce((a, c) => [...a, { ...c, IS_CHECKED: false, conList: "" }], []);
      // this.setItemFormArray(res, this.formGroup, 'SedList');
      // this.chRef.markForCheck();

      this.reInitDatatable();
    }, () => {
      this.loading = 2;
    });
  }

  private initDatatable(): void {
    let table: any = $('table');
    this.dataTable = table.DataTable({
      "scrollX": true,
      // "columns": [
      //   null,
      //   { "orderable": false },
      //   null,
      //   null,
      //   null,
      //   null,
      //   null
      // ]
    });
  }

  private reInitDatatable(): void {
    this.destroyDatatable()
    setTimeout(() => this.initDatatable(), 0)
  }

  private destroyDatatable() {
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }
  }


}
