import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { appConfig } from 'app/app.config';
import { TagAlConfig } from './tag-al.config';
import { LoaderService } from 'app/core/loader/loader.service';
import { finalize } from 'rxjs/operators';
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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private s_user: UserService,
    private chRef: ChangeDetectorRef,
    private s_loader: LoaderService
  ) {
    super();
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
  }

  @ViewChild("paymentPrice") inputPaymentPrice: ElementRef;

  ngOnInit() {
    this.formGroup = this.fb.group({
      alNo: new FormControl(null),
      sedNo: new FormControl(null),
      borrowerId: new FormControl(null),
      borrowerName: new FormControl(null),
      sendingPrice: new FormControl(null),
      remainPrice: new FormControl(null),
      price2Remain: new FormControl(null),
      paymentPrice: new FormControl(null),
      price1: new FormControl(null),
      netPrice1: new FormControl(null),
      price2: new FormControl(null),
      bankCode: new FormControl(null),
      documentRef: new FormControl(null),
      paymentType: new FormControl(null),
      branchId: new FormControl(null),
      createDate: new FormControl(null),
      createBy: new FormControl(null),
      remark: new FormControl(null),
      SedList: this.fb.array([])
    });

    const bank = `${appConfig.apiUrl}/Bank/DropDown`;
    this.http.get(bank).subscribe((x: any[]) => {
      this.chRef.markForCheck();
      this.bankingsDropdown = x;
      this.chRef.detectChanges();
    });

    this.loadingSedList();

    this.s_user.currentData.subscribe(x => {
      if (!x) return;
      this.chRef.markForCheck();
      this.mUser = x;
      this.chRef.detectChanges();
    });

  }

  loadingSedList() {
    const sedList = `${appConfig.apiUrl}/Ris/Sed/NormalList`;

    this.http.get(sedList).subscribe((x: any[]) => {
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
          createDate: new Date(),
          createBy: this.mUser.id,
          branchId: this.mUser.branch,
          paymentType: '1'
        });
        this.onChangePaymentPrice(this.inputPaymentPrice.nativeElement.value);
      })

      this.reInitDatatable();
    }, () => {
      this.loading = 2;
    });

    this.formGroup.get('paymentType').valueChanges.subscribe(x => {
      if (x == '1') {
        let bankCode = this.formGroup.get('bankCode');
        bankCode.setValue(null);
        bankCode.setValidators(null);
        let documentRef = this.formGroup.get('documentRef');
        documentRef.setValue(null);
        documentRef.setValidators(null);
      } else if (x == '2') {
        this.formGroup.get('bankCode').setValidators(Validators.required);
        this.formGroup.get('documentRef').setValidators(Validators.required);
      }
      this.formGroup.get('bankCode').updateValueAndValidity();
      this.formGroup.get('documentRef').updateValueAndValidity();
    });
  }

  checkingRecord(i: number) {
    for (let index = 0; index < this.SedList.length; index++) {
      if (index == i) {
        const val = this.SedList.at(index).get('IS_CHECKED').value;
        this.SedList.at(index).get('IS_CHECKED').patchValue(!val);
        if (!val == true) this.inputPaymentPrice.nativeElement.focus();
      } else {
        this.SedList.at(index).get('IS_CHECKED').patchValue(false);
      }
    }
  }

  onChangePaymentPrice(value: number) {
    let price = this.price2RemainState - value;
    // this.formGroup.get('price2').value - value;
    this.formGroup.get('price2Remain').patchValue(price);
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
      bankCode: f.bankCode,
      documentRef: f.documentRef,
      paymentType: f.paymentType,
      branchId: f.branchId,
      createDate: (f.createDate as Date).toISOString(),
      createBy: f.createBy,
      remark: f.remark
    }

    this.s_loader.showLoader();
    const url = `${appConfig.apiUrl}/Ris/Al`;
    this.http.post(url, f).pipe(
      finalize(() => this.s_loader.onEnd())
    ).subscribe(() => {
      toastr.success(message.created);
      this.formGroup.reset();
      this.loadingSedList();
    }, () => toastr.error(message.failed));
  }
}
