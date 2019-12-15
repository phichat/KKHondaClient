import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { setZeroHours } from 'app/app.config';
import { TagAlConfig } from './tag-al.config';
import { LoaderService } from 'app/core/loader/loader.service';
import { finalize } from 'rxjs/operators';
import { IPayment } from 'app/interfaces/payment.interface';
import { AlRegisService, SedRegisService } from 'app/services/ris';
declare var toastr: any;

@Component({
  selector: 'app-tag-al-form',
  templateUrl: './tag-al-form.component.html',
  styleUrls: ['./tag-al-form.component.scss']
})
export class TagAlFormComponent extends TagAlConfig implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  formPayment: IPayment;
  private paymentData: IPayment = {
    paymentPrice: null,
    paymentDate: new Date(),
    options: {
      invalid: true,
      disabled: false
    }
  };

  constructor(
    private fb: FormBuilder,
    private s_user: UserService,
    private chRef: ChangeDetectorRef,
    private s_loader: LoaderService,
    private s_alRegis: AlRegisService,
    private s_sedRegis: SedRegisService
  ) {
    super();
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
    this.mUser = this.s_user.cookies;
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      alNo: new FormControl(null),
      sedNo: new FormControl(null),
      borrowerId: new FormControl(null),
      borrowerName: new FormControl(null),
      sendingPrice: new FormControl(null),
      remainPrice: new FormControl(null),
      price2Remain: new FormControl(null),
      price1: new FormControl(null),
      netPrice1: new FormControl(null),
      price2: new FormControl(null),
      price3: new FormControl(null),
      paymentDate: new FormControl(null),
      paymentPrice: new FormControl(null),
      discountPrice: new FormControl(null),
      totalPaymentPrice: new FormControl(null),
      accBankId: new FormControl(null),
      documentRef: new FormControl(null),
      paymentType: new FormControl('1', Validators.required),
      branchId: new FormControl(null),
      createDate: new FormControl(new Date(), Validators.required),
      createBy: new FormControl(null),
      remark: new FormControl(null),
      SedList: this.fb.array([])
    });

    this.loadingSedList();
    this.PaymentData.next(this.paymentData);
  }

  loadingSedList() {

    this.s_sedRegis.NormalList().subscribe((x: any[]) => {
      if (!x.length) {
        this.loading = 1;
        while (this.SedList.length)
          this.SedList.removeAt(0);
        return;
      };
      const res = x.reduce((a, c) => [...a, { ...c, IS_CHECKED: false, conList: "" }], []);
      this.setItemFormArray(res, this.formGroup, 'SedList');
      this.chRef.markForCheck();

      this.SedList.valueChanges.subscribe((x: any[]) => {
        const rec = x.find(o => o.IS_CHECKED);
        this.price2RemainState = rec ? rec.price2Remain : null;
        this.formGroup.patchValue({
          sedNo: rec ? rec.sedNo : null,
          borrowerId: rec ? rec.createBy : null,
          borrowerName: rec ? rec.createName : null,
          paymentPrice: rec ? rec.price2Remain : null,
          price2: rec ? rec.price2 : null,
          // createDate: new Date(),
          createBy: this.mUser.id,
          branchId: this.mUser.branch,
          paymentType: '1'
        });

        this.formPayment = {
          ...this.formPayment,
          paymentPrice: this.price2RemainState
        }

        this.PaymentData.next(this.formPayment);
      })

      this.reInitDatatable();
    }, () => {
      this.loading = 2;
    });
  }

  checkingRecord(i: number) {
    for (let index = 0; index < this.SedList.length; index++) {
      if (index == i) {
        const val = this.SedList.at(index).get('IS_CHECKED').value;
        this.SedList.at(index).get('IS_CHECKED').patchValue(!val);
      } else {
        this.SedList.at(index).get('IS_CHECKED').patchValue(false);
      }
    }
  }

  formPaymentChange(event: IPayment) {
    this.formPayment = event;
    // debugger
    let price2Remain = this.price2RemainState - (event.totalPaymentPrice ? event.totalPaymentPrice : 0);
    this.formGroup.patchValue({
      paymentPrice: event.paymentPrice,
      discountPrice: event.discountPrice,
      totalPaymentPrice: event.paymentPrice,
      accBankId: event.accBankId,
      paymentDate: event.paymentDate,
      documentRef: event.documentRef,
      price2Remain: price2Remain
    });
  }

  get paymentMoreThenPrice2Remain(): boolean {
    return this.formGroup.get('totalPaymentPrice').value > this.price2RemainState
  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }

  onSubmit() {
    let f = { ...this.formGroup.value };
    f = {
      alNo: f.alNo,
      sedNo: f.sedNo,
      price2Remain: f.price2Remain,
      paymentPrice: f.paymentPrice,
      discountPrice: f.discountPrice,
      totalPaymentPrice: f.paymentPrice,
      paymentDate: f.paymentDate,
      accBankId: f.accBankId,
      documentRef: f.documentRef,
      paymentType: f.paymentType,
      branchId: f.branchId,
      createDate: setZeroHours(f.createDate),
      createBy: f.createBy,
      remark: f.remark
    }

    this.s_loader.showLoader();
    this.s_alRegis.Post(f).pipe(
      finalize(() => this.s_loader.onEnd())
    ).subscribe(() => {
      toastr.success(message.created);
      this.formGroup.reset();
      this.loadingSedList();
    }, () => toastr.error(message.failed));
  }
}
