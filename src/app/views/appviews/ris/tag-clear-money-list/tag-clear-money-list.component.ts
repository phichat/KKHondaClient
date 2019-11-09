import { Component, OnInit, OnDestroy } from '@angular/core';
import { TagClearMoneyListConfig } from './TagClearMoneyListConfig';
import { RevRegisService } from 'app/services/ris';

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
    private s_revRegis: RevRegisService
  ) {
    super();
  }

  ngOnInit() {

   

  }

  onSearch() {
    this.s_revRegis.SearchRevList({}).subscribe((x: any[]) => {
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


