import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TagAlListConfig } from './tag-al-list.config';
import { appConfig } from 'app/app.config';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient,
    private chRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      SedList: this.fb.array([])
    });

    const sedList = `${appConfig.apiUrl}/Ris/Al/All`;

    this.http.get(sedList).subscribe((x: any[]) => {
      if (!x.length) {
        this.loading = 1;
        return;
      };
      const res = x.reduce((a, c) => [...a, { ...c, IS_CHECKED: false, conList: "" }], []);
      this.setItemFormArray(res, this.formGroup, 'SedList');
      this.chRef.markForCheck();
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
