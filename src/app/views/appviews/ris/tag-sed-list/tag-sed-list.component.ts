import { Component, OnInit } from '@angular/core';
import { setZeroHours } from 'app/app.config';
import { TagSedListConfig } from './tag-sed-list.config';
import { SedRegisService } from 'app/services/ris';
import { FormBuilder, FormControl } from '@angular/forms';

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
    private s_sedRegis: SedRegisService,
    private fb: FormBuilder
  ) {
    super();
    this.formSearch = this.fb.group({
      sedNo: new FormControl(''),
      createDate: new FormControl(''),
      createName: new FormControl(''),
      status: new FormControl()
    })
  }

  ngOnInit() {

  }

  onSearch() {
    let form = { ...this.formSearch.value };
    form = { ...form, createDate: setZeroHours(form.createDate) };
    this.loading = 0
    this.s_sedRegis.SearchSedList(form)
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
