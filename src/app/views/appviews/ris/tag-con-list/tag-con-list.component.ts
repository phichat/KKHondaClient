import { Component, OnInit, OnDestroy } from '@angular/core';
import { TagClListConfig } from './tag-con-list.config';
import { FormBuilder, FormControl } from '@angular/forms';
import { CarRegisService } from 'app/services/ris';

@Component({
  selector: 'app-tag-con-list',
  templateUrl: './tag-con-list.component.html',
  styleUrls: ['./tag-con-list.component.scss']
})
export class TagConListComponent extends TagClListConfig implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  constructor(
    private fb: FormBuilder,
    private s_carRegis: CarRegisService
  ) {
    super();
    this.formSearch = this.fb.group({
      bookingNo: new FormControl(null),
      revNo: new FormControl(null),
      status1: new FormControl(null),
      status2: new FormControl(null),
      eNo: new FormControl(null),
      fNo: new FormControl(null),
    });
  }

  ngOnInit() {

  }

  onSearch() {
    let form = this.formSearch.value;
    // form = JSON.stringify(form);  
    this.loading = 0;
    this.s_carRegis.SearchRegisList(form)
      .subscribe(x => {
        if (!x.length) {
          this.loading = 1;
          return;
        };
        this.conList = x;

        this.reInitDatatable();
      }, () => {
        this.loading = 2;
      });
  }

}
