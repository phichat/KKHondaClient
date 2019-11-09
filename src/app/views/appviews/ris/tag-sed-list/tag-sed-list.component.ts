import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { TagSedListConfig } from './tag-sed-list.config';
import { SedRegisService } from 'app/services/ris';

@Component({
  selector: 'app-tag-sed-list',
  templateUrl: './tag-sed-list.component.html',
  styleUrls: ['./tag-sed-list.component.scss']
})
export class TagSedListComponent extends TagSedListConfig implements OnInit {

  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  constructor(
    private s_sedRegis: SedRegisService
  ) {
    super();
  }

  ngOnInit() {

  }

  onSearch() {
    this.s_sedRegis.SearchSedList({})
      .subscribe((x: any[]) => {
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

}
