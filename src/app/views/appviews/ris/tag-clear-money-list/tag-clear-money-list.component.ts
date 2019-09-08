import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SedStatus } from 'app/entities/ris.entities';
import { TagClearMoneyListConfig } from './TagClearMoneyListConfig';

@Component({
  selector: 'app-tag-clear-money-list',
  templateUrl: './tag-clear-money-list.component.html',
  styleUrls: ['./tag-clear-money-list.component.scss']
})
export class TagClearMoneyListComponent extends TagClearMoneyListConfig implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit() {

    const apiURL = `${this.risUrl}/Rev/All`;
    this.http.get(apiURL).subscribe((x: any[]) => {
      if (x.length == 0) {
        this.loading = 1;
        return;
      }
      this.RevList = x;

      this.reInitDatatable();
    }, () => {
      this.loading = 2;
    });

  }

}


