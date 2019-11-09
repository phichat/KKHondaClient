import { Component, OnInit, OnDestroy } from '@angular/core';
import { appConfig } from 'app/app.config';
import { TagClListConfig } from './tag-cl-list.config';
import { ClRegisService } from 'app/services/ris';


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
    private s_clRegis: ClRegisService
  ) {
    super();
  }

  ngOnInit() {
  }

  onSearch() {
    this.s_clRegis.SearchClList({}).subscribe((x: any[]) => {
      if (!x.length) {
        this.loading = 1;
        return;
      };
      this.clList = x;
      this.reInitDatatable();
    }, () => {
      this.loading = 2;
    });
  }
}
