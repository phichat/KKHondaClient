import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { TagConcludeListConfig } from './tag-conclude-list.config';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';

@Component({
  selector: 'app-tag-conclude-list',
  templateUrl: './tag-conclude-list.component.html',
  styleUrls: ['./tag-conclude-list.component.scss']
})
export class TagConcludeListComponent extends TagConcludeListConfig implements OnInit {

  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit() {

    const apiURL = `${appConfig.apiUrl}/Ris/Sed/All`;
    this.http.get(apiURL).subscribe((x: any[]) => {
      if (x.length == 0) {
        this.loading = 1;
        return;
      }
      this.SedList = x;
      
      this.reInitDatatable();
    }, () => {
      this.loading = 2;
    });

  }

  private initDatatable(): void {
    let table: any = $('table');
    this.dataTable = table.DataTable({
      scrollX: true
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
