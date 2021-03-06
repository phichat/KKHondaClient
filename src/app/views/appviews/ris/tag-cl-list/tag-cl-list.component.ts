import { Component, OnInit, OnDestroy } from '@angular/core';
import { appConfig, setZeroHours } from 'app/app.config';
import { TagClListConfig } from './tag-cl-list.config';
import { ClRegisService } from 'app/services/ris';
import { FormBuilder, FormControl } from '@angular/forms';


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
    private s_clRegis: ClRegisService,
    private fb: FormBuilder
  ) {
    super();
    this.formSearch = this.fb.group({
      sedNo: new FormControl(null),
      alNo: new FormControl(null),
      clNo: new FormControl(null),
      refundName: new FormControl(null),
      createName: new FormControl(null),
      createDate: new FormControl(null),
      status: new FormControl(null),
    })
  }

  ngOnInit() {
  }

  onSearch() {
    let form = { ...this.formSearch.value };
    form = { ...form, createDate: setZeroHours(form.createDate) };
    this.loading = 0;
    this.s_clRegis.SearchClList(form).subscribe((x: any[]) => {
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
