import { Component, OnInit, OnDestroy } from '@angular/core';
import { TagClearMoneyListConfig } from './TagClearMoneyListConfig';
import { RevRegisService } from 'app/services/ris';
import { FormBuilder, FormControl } from '@angular/forms';
import { setZeroHours } from 'app/app.config';
import { tap } from 'rxjs/operators';

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
    private s_revRegis: RevRegisService,
    private fb: FormBuilder
  ) {
    super();
    this.formSearch = this.fb.group({
      revNo: new FormControl(null),
      createDate: new FormControl(null),
      createName: new FormControl(null),
      status: new FormControl()
    })
  }

  ngOnInit() {
  }

  onSearch() {
    let form = { ...this.formSearch.value };
    form = { ...form, createDate: setZeroHours(form.createDate) };
    this.loading = 0
    this.s_revRegis.SearchRevList(form)
      .subscribe((x: any[]) => {
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


