import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TagConFormConfig } from './tag-con-form.config';
import { LoaderService } from 'app/core/loader/loader.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/services/users';
import { finalize, mergeMap, tap, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { DropDownModel } from 'app/models/drop-down-model';
import { appConfig } from 'app/app.config';
import { message } from 'app/app.message';
import { UserForRis as EURIS } from 'app/entities/ris.entities';
import { CarRegisService } from 'app/services/ris';
import { ReasonService } from 'app/services/masters';
import { IPayment } from 'app/interfaces/payment.interface';
declare var toastr: any;

@Component({
  selector: 'app-tag-con-form-detail',
  templateUrl: './tag-con-form-detail.component.html'
})
export class TagConFormDetailComponent extends TagConFormConfig implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.$BookingId.next(null);
  }

  private paymentData: IPayment = {
    paymentPrice: null,
    options: {
      invalid: false,
      disabled: true
    }
  };

  constructor(
    private fb: FormBuilder,
    private s_loader: LoaderService,
    private s_user: UserService,
    private activeRoute: ActivatedRoute,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private s_CarRegis: CarRegisService,
    private s_Reason: ReasonService
  ) {
    super()
    this.mUser = this.s_user.cookies;
    this.isSeller = this.mUser.gId == EURIS.Sale;
    this.PaymentData.next(this.paymentData);
  }
  isSeller: boolean;
  public code: string;

  ngOnInit() {
    this.formGroup = this.fb.group({
      bookingId: new FormControl(null),
      bookingNo: new FormControl(null),
      status1: new FormControl(null),
      status2: new FormControl(null),
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
      remark: new FormControl(null),
      visitorName: new FormControl(null),
      ownerName: new FormControl(null),
      province: new FormControl(null),
      tagNo: new FormControl(null),

      paymentType: new FormControl({ value: null, disabled: true }),
      paymentPrice: new FormControl(null),
      discountPrice: new FormControl(null),
      totalPaymentPrice: new FormControl(null),
      accBankId: new FormControl(null),
      paymentDate: new FormControl(null),
      documentRef: new FormControl(null),
    });

    this.activeRoute.params.pipe(
      tap(() => this.s_loader.showLoader()),
      mergeMap((x) => {
        this.code = x['code'];
        return combineLatest(
          this.s_CarRegis.GetByConNo(this.code),
          this.s_Reason.DropDown()
        ).pipe(
          map(o => {
            return {
              conItem: o[0],
              reason: o[1] as DropDownModel[]
            };
          })
        );
      })
    ).subscribe(o => {
      this.chRef.markForCheck();
      const conItem = o.conItem;
      this.reasonDropdown = o.reason;
      this.formGroup.patchValue({
        ...conItem,
        paymentType: `${conItem.paymentType}`,
        updateBy: this.mUser.id
      });
      
      this.paymentData = {
        ...this.paymentData,
        paymentDate: conItem.paymentDate,
        paymentPrice: conItem.netPrice1,
        discountPrice: conItem.discountPrice,
        totalPaymentPrice: conItem.totalPaymentPrice,
        accBankId: conItem.accBankId,
        documentRef: conItem.documentRef
      }
      this.PaymentData.next(this.paymentData);
      this.$BookingId.next(conItem['bookingId']);
      this.$Status1.next(conItem['status1']);
      this.s_loader.onEnd();
    });
  }

  cancel() {
    if (!confirm('ยืนยันการยกเลิก "บันทึกเรื่องดำเนินการ" หรือไม่?')) return;
    const f = { ...this.formGroup.value };
    this.s_loader.showLoader()
    this.s_CarRegis.Cancel(f).subscribe(() => {
      this.s_loader.onEnd();
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

  openHistory() {
    this.$CarHistoryBookingId.next(this.formGroup.get('bookingId').value)
  }
}
