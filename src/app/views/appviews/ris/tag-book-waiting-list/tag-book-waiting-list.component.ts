import { Component, OnInit, OnDestroy } from '@angular/core';
import { TagBookWaitingListListConfig } from './tag-book-waiting-list.config';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { FormBuilder, FormControl, FormArray } from '@angular/forms';
import { CarRegisService } from 'app/services/ris';

@Component({
  selector: 'app-tag-book-waiting-list',
  templateUrl: './tag-book-waiting-list.component.html',
  styleUrls: ['./tag-book-waiting-list.component.scss']
})
export class TagBookWaitingListComponent extends TagBookWaitingListListConfig implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  constructor(
    private fb: FormBuilder,
    private s_carRegis: CarRegisService
  ) {
    super();
    this.formSearch = this.fb.group({
      bookingPaymentType: this.fb.array([]),
      sellNo: new FormControl(null),
      regisName: new FormControl(null),
      bookName: new FormControl(null),
      bookIdCard: new FormControl(null),
      eNo: new FormControl(null),
      fNo: new FormControl(null)
    });
    this.addCheckboxes();
  }

  ngOnInit() {
  }

  private addCheckboxes() {
    this.BookingPaymentTypeList.forEach((o, i) => {
      const control = new FormControl(null); // if first item set to true, else false
      (this.formSearch.controls.bookingPaymentType as FormArray).push(control);
    });
  }

  onSearch() {
    const b = (this.formSearch.get('bookingPaymentType').value as any[])
      .map((v, i) => v ? this.BookingPaymentTypeList[i].id : null)
      .filter(v => v != null);

    let f = {
      ...this.formSearch.getRawValue(),
      bookingPaymentType: b.length ? [...b] : [null]
    };

    // f = JSON.stringify(f);
    this.loading = 0;
    this.s_carRegis.SearchWaitingTag(f)
      .subscribe((x: any[]) => {
        if (!x.length) {
          this.loading = 1;
          return;
        };
        this.waitingList = x;
        this.reInitDatatable();
      }, () => {
        this.loading = 2;
      });
  }
}
