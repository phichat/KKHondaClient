import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TagConFormConfig } from './tag-con-form.config';
import { LoaderService } from 'app/core/loader/loader.service';
import { finalize, mergeMap, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { setZeroHours } from 'app/app.config';
import { CarRegisService } from 'app/services/ris';
import { IPayment } from 'app/interfaces/payment.interface';
declare var toastr: any;

@Component({
  selector: 'app-tag-con-form',
  templateUrl: './tag-con-form.component.html',
  styleUrls: ['./tag-con-form.component.scss']
})
export class TagConFormComponent extends TagConFormConfig implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    this.TagListItem$.next(null);
  }

  private paymentData: IPayment = {
    paymentPrice: null,
    options: {
      invalid: true,
      disabled: false
    }
  };

  constructor(
    private fb: FormBuilder,
    private s_loader: LoaderService,
    private chRef: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private s_user: UserService,
    private router: Router,
    private s_carRegis: CarRegisService
  ) {
    super()
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
    this.mUser = this.s_user.cookies;
    this.formPayment = this.paymentData;
    this.PaymentData.next(this.paymentData);
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      bookingNo: new FormControl(null),
      bookingDate: new FormControl(null, Validators.required),
      status1: new FormControl(1),
      createDate: new FormControl(new Date()),
      createBy: new FormControl(null),
      updateDate: new FormControl(null),
      updateBy: new FormControl(null),
      branchId: new FormControl(null),
      reasonCode: new FormControl(null),
      eNo: new FormControl(null, Validators.required),
      fNo: new FormControl(null, Validators.required),
      price1: new FormControl(null),
      cutBalance: new FormControl(null),
      netPrice1: new FormControl(null),
      vatPrice1: new FormControl(null),
      price2: new FormControl(null),
      price3: new FormControl(null),
      totalPrice: new FormControl(null),

      paymentPrice: new FormControl(null),
      discountPrice: new FormControl(null),
      totalPaymentPrice: new FormControl(null),
      accBankId: new FormControl(null),
      paymentDate: new FormControl(null),
      documentRef: new FormControl(null),

      remark: new FormControl(null),
      ownerCode: new FormControl(null, Validators.required),
      ownerName: new FormControl(null, Validators.required),
      visitorCode: new FormControl(null, Validators.required),
      visitorName: new FormControl(null, Validators.required),
      province: new FormControl(null),
      tagNo: new FormControl(null),
      paymentType: new FormControl('1', Validators.required)
    });

    this.TagListItem$.subscribe(x => {
      this.chRef.markForCheck();
      if (!x) return;
      const price1 = x.reduce((a, c) => a += c.itemPrice1, 0);
      const price2 = x.reduce((a, c) => a += c.itemPrice2, 0);
      const price3 = x.reduce((a, c) => a += c.itemPrice3, 0);
      const vatPrice1 = x.reduce((a, c) => a += c.itemVatPrice1, 0);
      const netPrice1 = x.reduce((a, c) => a += c.itemNetPrice1, 0);
      const totalPrice = price1 + vatPrice1 + price2 + price3;
      this.formGroup.patchValue({
        price1: price1,
        cutBalance: price1 + vatPrice1,
        price2: price2,
        price3: price3,
        vatPrice1: vatPrice1,
        netPrice1: netPrice1,
        totalPrice: totalPrice
      });

      const discountPrice = this.formPayment ? this.formPayment.discountPrice : 0;
      this.formPayment = {
        ...this.formPayment, 
        paymentPrice: netPrice1,
        discountPrice: discountPrice,
        totalPaymentPrice: netPrice1 - discountPrice
      }
      this.PaymentData.next(this.formPayment);
      this.chRef.detectChanges();
    });

    this.activeRoute.params
      .pipe(
        tap(() => this.s_loader.showLoader()),
        mergeMap(x => this.s_carRegis.GetCarBySellNo(x['code']))
      ).subscribe(x => {
        this.chRef.markForCheck();
        if (!x) return;
        this.$Car.next(x);
        this.formGroup.patchValue({
          ...x,
          branchId: this.mUser.branch,
          createBy: this.mUser.id
        });
        this.s_loader.onEnd()
        this.chRef.detectChanges();
      })
  }

  formPaymentChange(event: IPayment) {
    this.formPayment = event;
    this.formGroup.patchValue({
      paymentPrice: event.paymentPrice,
      discountPrice: event.discountPrice,
      totalPaymentPrice: event.paymentPrice,
      accBankId: event.accBankId,
      paymentDate: event.paymentDate,
      documentRef: event.documentRef
    });
  }

  onSubmit() {
    let f = { ...this.formGroup.value };
    let his = {
      ...this.TagHistory$.value,
      // carId: 0,
      branchId: f.branchId,
      eNo: f.eNo,
      fNo: f.fNo,
      ownerCode: f.ownerCode,
      visitorCode: f.visitorCode
    };
    let listItem = this.TagListItem$.value;
    listItem = listItem.reduce((a, c) => [...a, { ...c, runId: 0, bookingId: 0 }], []);

    f = {
      ...f,
      bookingId: 0,
      bookingDate: setZeroHours(f.bookingDate),
      createDate: (f.createDate as Date).toISOString()
    }

    const form = {
      tagRegis: f,
      tagHistory: his,
      tagListItem: listItem
    };

    this.s_loader.showLoader();
    this.s_carRegis.Post(form)
      .pipe(
        finalize(() => this.s_loader.onEnd())
      ).subscribe(() => {
        toastr.success(message.created);
        this.router.navigate(['ris/con-list']);
      }, () => toastr.error(message.failed));
  }

  openHistory() {
    this.$FNo.next(this.formGroup.get('fNo').value);
    this.$ENo.next(this.formGroup.get('eNo').value);
  }
}
