import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TagConFormConfig } from './tag-con-form.config';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from 'app/core/loader/loader.service';
import { appConfig, getDateMyDatepicker } from 'app/app.config';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/services/users';

@Component({
  selector: 'app-tag-con-form',
  templateUrl: './tag-con-form.component.html',
  styleUrls: ['./tag-con-form.component.scss']
})
export class TagConFormComponent extends TagConFormConfig implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    this.TagListItem$.next(null);
  }

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private s_loader: LoaderService,
    private chRef: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private s_user: UserService
  ) {
    super()
  }

  ngOnInit() {
    this.s_loader.showLoader();

    this.formGroup = this.fb.group({
      bookingNo: new FormControl(null),
      bookingStatus: new FormControl(null),
      createDate: new FormControl(new Date()),
      createBy: new FormControl(null),
      updateDate: new FormControl(null),
      updateBy: new FormControl(null),
      branchId: new FormControl(null),
      reasonCode: new FormControl(null),
      eNo: new FormControl(null),
      fNo: new FormControl(null),
      price1: new FormControl(null),
      vatPrice1: new FormControl(null),
      price2: new FormControl(null),
      totalPrice: new FormControl(null)
    })

    this.TagListItem$.subscribe(x => {
      this.chRef.markForCheck();
      const price1 = x.reduce((a, c) => a += c.itemPrice1, 0);
      const price2 = x.reduce((a, c) => a += c.itemPrice2, 0);
      const totalPrice = price1 + price2;
      const vatPrice1 = x.reduce((a, c) => a += c.itemVatPrice1, 0);
      this.formGroup.patchValue({
        price1: price1,
        price2: price2,
        vatPrice1: vatPrice1,
        totalPrice: totalPrice
      })
      this.chRef.detectChanges();
    });

    this.activeRoute.params.subscribe(x => {
      if (x['code']) {
        const url = `${this.apiURL}/GetCarBySellNo`;
        const params = { sellNo: x['code'] }
        this.http.get(url, { params })
          .pipe(
            finalize(() => this.s_loader.onEnd())
          ).subscribe((o: any) => {
            this.chRef.markForCheck();
            if (!o) return;
            this.$Car.next(o);
            this.formGroup.patchValue({
              eNo: o.eNo,
              fNo: o.fNo,
            })
            this.chRef.detectChanges();
          })
      }
    })

    this.s_user.currentData.subscribe(x => {
      if (!x) return;
      this.chRef.markForCheck();
      this.mUser = x;
      this.formGroup.patchValue({
        createBy: x.id,
        branchId: x.branch
      });
      this.chRef.detectChanges();
    });
  }

  onSubmit() {
    
    let f = { ...this.formGroup.value, tagHistory: this.TagHistory$.value };
    f = {
      ...f,
      createDate: (f.createDate as Date).toISOString(),
      ListItem: this.TagListItem$.value
    };
    console.log(f);

  }
}
