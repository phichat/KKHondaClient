import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { TagConFormConfig } from './tag-con-form.config';
import { HttpClient } from '@angular/common/http';
import { finalize, map, tap, mergeMap } from 'rxjs/operators';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'app/core/loader/loader.service';
import { UserService } from 'app/services/users';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { RisLocalStoreage as LS } from 'app/entities/ris.entities';
import { message } from 'app/app.message';
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
  }

  public $BookingId = new BehaviorSubject<number>(null);
  public $BookingStatus = new BehaviorSubject<number>(null);
  private code: string;

  ngOnInit() {
    this.s_loader.showLoader();

    this.formGroup = this.fb.group({
      bookingId: new FormControl(null),
      bookingNo: new FormControl(null),
      bookingStatus: new FormControl(null),
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
      price2: new FormControl(null),
      totalPrice: new FormControl(null),
      remark: new FormControl(null)
    });

    this.activeRoute.params.pipe(
      tap(() => this.s_loader.showLoader()),
      mergeMap((x) => {
        const conNoUrl = `${this.risUrl}/GetByConNo`;
        const params = { conNo: x['code'] };
        this.code = x['code'];
        return combineLatest(
          this.http.get(conNoUrl, { params }),
          this.s_user.currentData
        ).pipe(
          map(o => {
            return {
              conItem: o[0],
              curretUser: o[1]
            };
          })
        );
      })
    ).subscribe(o => {
      this.chRef.markForCheck();
      this.$BookingStatus.next(o.conItem['bookingStatus']);
      const conItem = o.conItem;
      this.mUser = o.curretUser;
      this.formGroup.patchValue({
        ...conItem,
        updateBy: o.curretUser['id']
      });
      this.$BookingId.next(conItem['bookingId']);
      this.s_loader.onEnd();
    });

    this.TagListItem$.subscribe(x => {
      this.chRef.markForCheck();
      if (!x) return;
      const remark = x.reduce((a, c) => [...a, c.itemName], []).join(', ')
      const price1 = x.reduce((a, c) => a += c.itemPrice1, 0);
      const price2 = x.reduce((a, c) => a += c.itemPrice2, 0);
      const vatPrice1 = x.reduce((a, c) => a += c.itemVatPrice1, 0);
      const totalPrice = price1 + vatPrice1 + price2;
      this.formGroup.patchValue({
        remark: remark,
        price1: price1,
        price2: price2,
        vatPrice1: vatPrice1,
        totalPrice: totalPrice
      })
      this.chRef.detectChanges();
    });


  }

  onSubmit() {
    let tagRegis = { ...this.formGroup.value };
    let tagHistory = { ...this.TagHistory$.value };
    let tagListItem = this.TagListItem$.value;
    const trashTagListItem = (JSON.parse(localStorage.getItem(LS.TrashCarRegisListItem)) || []) as any[];
    tagListItem = tagListItem.reduce((a, c) => [...a, { ...c, bookingId: tagRegis.bookingId }], []);

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
}
