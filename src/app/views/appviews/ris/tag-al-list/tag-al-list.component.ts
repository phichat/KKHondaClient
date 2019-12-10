import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TagAlListConfig } from './tag-al-list.config';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AlRegisService } from 'app/services/ris';
import { setZeroHours } from 'app/app.config';

@Component({
  selector: 'app-tag-al-list',
  templateUrl: './tag-al-list.component.html',
  styleUrls: ['./tag-al-list.component.scss']
})
export class TagAlListComponent extends TagAlListConfig implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  constructor(
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private s_alRegis: AlRegisService
  ) {
    super();
    this.formSearch = this.fb.group({
      sedNo: new FormControl(null),
      alNo: new FormControl(null),
      borrowerName: new FormControl(null),
      createName: new FormControl(null),
      createDate: new FormControl(null),
      status: new FormControl(null),
    })
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      SedList: this.fb.array([])
    });
  }

  onSearch() {
    let form = { ...this.formSearch.value };
    form = { ...form, createDate: setZeroHours(form.createDate) };
    this.loading = 0;
    this.s_alRegis.SearchAlList(form).subscribe((x: any[]) => {
      if (!x.length) {
        this.loading = 1;
        return;
      };
      const res = x.reduce((a, c) => [...a, { ...c, IS_CHECKED: false, conList: "" }], []);
      this.setItemFormArray(res, this.formGroup, 'SedList');
      this.chRef.markForCheck();
      this.reInitDatatable();
    }, () => {
      this.loading = 2;
    });
  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }

}
