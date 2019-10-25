import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TagConFormConfig } from './tag-con-form.config';
import { HttpClient } from '@angular/common/http';
import { finalize, tap, mergeMap } from 'rxjs/operators';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'app/core/loader/loader.service';
import { UserService } from 'app/services/users';
import { RisLocalStoreage as LS, UserForRis as EURIS } from 'app/entities/ris.entities';
import { message } from 'app/app.message';
import { getDateMyDatepicker } from 'app/app.config';

declare var toastr: any;

@Component({
  selector: 'app-tag-con-form-edit',
  templateUrl: './tag-con-form-edit.component.html',
  styleUrls: ['./tag-con-form.component.scss']
})
export class TagConFormEditComponent extends TagConFormConfig implements OnInit {

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private s_user: UserService,
    private s_loader: LoaderService,
    private chRef: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    super()

    this.mUser = this.s_user.cookies;
  }
  private code: string;

  ngOnInit() {
    this.s_loader.showLoader();

    this.formGroup = this.fb.group({
      bookingId: new FormControl(null),
      bookingNo: new FormControl(null),
      bookingDate: new FormControl(null),
      status1: new FormControl(null),
      status2: new FormControl(null),
      statusDesc: new FormControl(null),
      createDate: new FormControl(null),
      createBy: new FormControl(null),
      createName: new FormControl(null),
      updateDate: new FormControl(null),
      updateBy: new FormControl(null),
      branchId: new FormControl(null),
      reasonCode: new FormControl(null),
      eNo: new FormControl(null),
      fNo: new FormControl(null),
      price1: new FormControl(null),
      vatPrice1: new FormControl(null),
      netPrice1: new FormControl(null),
      price2: new FormControl(null),
      price3: new FormControl(null),
      totalPrice: new FormControl(null),
      remark: new FormControl(null),
      ownerCode: new FormControl(null, Validators.required),
      ownerName: new FormControl(null, Validators.required),
      visitorCode: new FormControl(null, Validators.required),
      visitorName: new FormControl(null, Validators.required),
      province: new FormControl(null),
      tagNo: new FormControl(null)
    });

    this.activeRoute.params.pipe(
      tap(() => this.s_loader.showLoader()),
      mergeMap((x) => {
        const conNoUrl = `${this.risUrl}/GetByConNo`;
        const params = { conNo: x['code'] };
        this.code = x['code'];
        return this.http.get(conNoUrl, { params });
      })
    ).subscribe(o => {
      this.chRef.markForCheck();
      this.$Status1.next(o['status1']);
      this.$Status2.next(o['status2']);
      this.formGroup.patchValue({
        ...o,
        updateBy: this.mUser.id,
        bookingDate: this.setDateMyDatepicker(o['bookingDate'])
      });
      this.$BookingId.next(o['bookingId']);
      this.s_loader.onEnd();
    });

    this.TagListItem$.subscribe(x => {
      this.chRef.markForCheck();
      if (!x) return;
      // const remark = x.reduce((a, c) => [...a, c.itemName], []).join(', ')
      const price1 = x.reduce((a, c) => a += c.itemPrice1, 0);
      const vatPrice1 = x.reduce((a, c) => a += c.itemVatPrice1, 0);
      const netPrice1 = x.reduce((a, c) => a += c.itemNetPrice1, 0);
      const price2 = x.reduce((a, c) => a += c.itemPrice2, 0);
      const price3 = x.reduce((a, c) => a += c.itemPrice3, 0);
      const totalPrice = price1 + vatPrice1 + price2 + price3;
      this.formGroup.patchValue({
        // remark: remark,
        price1: price1,
        cutBalance: price1 + vatPrice1,
        price2: price2,
        price3: price3,
        vatPrice1: vatPrice1,
        netPrice1: netPrice1,
        totalPrice: totalPrice
      })
      this.chRef.detectChanges();
    });

  }

  onSubmit() {
    let tagRegis = { ...this.formGroup.value };
    const tagHistory = {
      ...this.TagHistory$.value,
      ownerCode: tagRegis.ownerCode,
      visitorCode: tagRegis.visitorCode
    };
    let tagListItem = this.TagListItem$.value;
    const trashTagListItem = (JSON.parse(localStorage.getItem(LS.TrashCarRegisListItem)) || []) as any[];
    tagListItem = tagListItem.reduce((a, c) => [...a, { ...c, bookingId: tagRegis.bookingId }], []);

    tagRegis = {
      ...tagRegis,
      bookingDate: getDateMyDatepicker(tagRegis.bookingDate)
    }

    const form = {
      tagRegis: tagRegis,
      tagHistory,
      tagListItem,
      trashTagListItem
    };

    this.s_loader.showLoader();
    const url = `${this.risUrl}/Update`;
    this.http.post(url, form)
      .pipe(
        finalize(() => this.s_loader.onEnd())
      ).subscribe(() => {
        toastr.success(message.created);
        this.router.navigate(['ris/con-form-detail', this.code]);
      }, () => toastr.error(message.failed));

  }

  openHistory() {
    this.$CarHistoryBookingId.next(this.formGroup.get('bookingId').value)
  }
}
