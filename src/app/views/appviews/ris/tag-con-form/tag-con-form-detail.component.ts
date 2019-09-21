import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TagConFormConfig } from './tag-con-form.config';
import { LoaderService } from 'app/core/loader/loader.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/services/users';
import { finalize, mergeMap, tap, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { DropDownModel } from 'app/models/drop-down-model';
import { appConfig } from 'app/app.config';
import { message } from 'app/app.message';
declare var toastr: any;

@Component({
  selector: 'app-tag-con-form-detail',
  templateUrl: './tag-con-form-detail.component.html'
})
export class TagConFormDetailComponent extends TagConFormConfig implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.$BookingId.next(null);
  }

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private s_loader: LoaderService,
    private s_user: UserService,
    private activeRoute: ActivatedRoute,
    private chRef: ChangeDetectorRef,
    private router: Router
  ) {
    super()
  }

  public code: string;
  public $BookingId = new BehaviorSubject<number>(null);

  ngOnInit() {
    this.formGroup = this.fb.group({
      bookingId: new FormControl(null),
      bookingNo: new FormControl(null),
      bookingStatus: new FormControl(null),
      statusDesc: new FormControl(null),
      createDate: new FormControl(null),
      createName: new FormControl(null),
      updateDate: new FormControl(null),
      updateBy: new FormControl(null),
      branchId: new FormControl(null),
      reasonCode: new FormControl(null),
      eNo: new FormControl(null, Validators.required),
      fNo: new FormControl(null, Validators.required),
      price1: new FormControl(null),
      vatPrice1: new FormControl(null),
      netPrice1: new FormControl(null),
      cutBalance: new FormControl(null),
      price2: new FormControl(null),
      price3: new FormControl(null),
      totalPrice: new FormControl(null),
      reason: new FormControl(null, Validators.required),
      remark: new FormControl(null)
    })

    this.activeRoute.params.pipe(
      tap(() => this.s_loader.showLoader()),
      mergeMap((x) => {
        const conNoUrl = `${this.risUrl}/GetByConNo`;
        const reasonUrl = `${appConfig.apiUrl}/Reason/DropDown`;
        const params = { conNo: x['code'] };
        this.code = x['code'];
        return combineLatest(
          this.http.get(conNoUrl, { params }),
          this.http.get(reasonUrl),
          this.s_user.currentData
        ).pipe(
          map(o => {
            return {
              conItem: o[0],
              reason: o[1] as DropDownModel[],
              curretUser: o[2]
            };
          })
        );
      })
    ).subscribe(o => {
      this.chRef.markForCheck();
      const conItem = o.conItem;
      this.reasonDropdown = o.reason;
      this.mUser = o.curretUser;
      this.formGroup.patchValue({
        ...conItem,
        updateBy: o.curretUser['id']
      });
      this.$BookingId.next(conItem['bookingId']);
      this.s_loader.onEnd();
    });
  }

  cancel() {
    if (!confirm('ยืนยันการยกเลิก "บันทึกเรื่องดำเนินการ" หรือไม่?')) return;
    const f = { ...this.formGroup.value };
    const url = `${this.risUrl}/Cancel`;
    this.http.post(url, f).pipe(
      tap(() => this.s_loader.showLoader()),
      finalize(() => this.s_loader.onEnd())
    ).subscribe(() => {
      toastr.success(message.created);
      this.router.navigate(['ris/con-list']);
    }, () => toastr.error(message.failed))
  }

  printDeposit() {
    const url = `${appConfig.apikkWeb}/php/print_registertag_deposit.php?booking_id=${this.formGroup.get('bookingId').value}`;
    window.open(url, '_blank');
  }

  printPayment() {
    const url = `${appConfig.apikkWeb}/php/print_registertag_payment.php?booking_id=${this.formGroup.get('bookingId').value}`;
    window.open(url, '_blank');
  }

}
