import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ModelUser } from 'app/models/users';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { DropDownModel } from 'app/models/drop-down-model';
import { appConfig, getDateMyDatepicker } from 'app/app.config';
import { TagClConfig } from './tag-cl.config';
import { LoaderService } from 'app/core/loader/loader.service';
import { finalize } from 'rxjs/operators';
import { IPayment } from 'app/interfaces/payment.interface';

declare var toastr: any;
@Component({
  selector: 'app-tag-cl-form',
  templateUrl: './tag-cl-form.component.html',
  styleUrls: ['./tag-cl-form.component.scss']
})
export class TagClFormComponent extends TagClConfig implements OnInit {

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
    };
    this.mUser = this.s_user.cookies;
  }
  checkedAll: boolean;
  bankingsDropdown = new Array<DropDownModel>();
  formPayment: IPayment;

  ngOnInit() {
    this.formGroup = this.fb.group({
      clNo: new FormControl(null),
      alNo: new FormControl(null),
      revNo: new FormControl(null),
      refundId: new FormControl(null),
      refundName: new FormControl(null),
      balancePrice: new FormControl(null),
      // receivePrice: new FormControl(null, Validators.required),
      paymentPrice: new FormControl(null, Validators.required),
      discountPrice: new FormControl(null),
      totalPaymentPrice: new FormControl(null, Validators.required),
      netPrice: new FormControl(null),
      accBankId: new FormControl(null),
      documentRef: new FormControl(null),
      paymentDate: new FormControl(null),
      paymentType: new FormControl('1', Validators.required),
      branchId: new FormControl(null),
      createDate: new FormControl(null, Validators.required),
      createBy: new FormControl(null),
      remark: new FormControl(null),
      AlList: this.fb.array([])
    });

    this.loadingAlList();
  }

  loadingAlList() {
    const carList = `${appConfig.apiUrl}/Ris/Al/NormalList`;
    this.http.get(carList).subscribe((x: any[]) => {
      
      if (!x.length) {
        this.loading = 1;
        while (this.AlList.length)
          this.AlList.removeAt(0);
        return;
      };
      
      const res = x.reduce((a, c) => [...a, { ...c, IS_CHECKED: false }], []);
      this.setItemFormArray(res, this.formGroup, 'AlList');
      this.chRef.markForCheck();

      this.AlList.valueChanges.subscribe((x: any[]) => {
        const rec = x.find(o => o.IS_CHECKED);
        this.balancePriceState = rec ? rec.balancePrice : null;
        this.formGroup.patchValue({
          alNo: rec ? rec.alNo : null,
          refundId: rec ? rec.createBy : null,
          refundName: rec ? rec.createName : null,
          balancePrice: this.balancePriceState,
          // receivePrice: this.balancePriceState,
          netPrice: rec ? rec.netPrice : null,
          // createDate: new Date(),
          createBy: this.mUser.id,
          branchId: this.mUser.branch,
          paymentType: '1'
        });
      });

      this.reInitDatatable();
    }, () => this.loading = 2);
  }

  checkingRecord(i: number) {
    for (let index = 0; index < this.AlList.length; index++) {
      if (index == i) {
        const val = this.AlList.at(index).get('IS_CHECKED').value;
        this.AlList.at(index).get('IS_CHECKED').patchValue(!val);
      } else {
        this.AlList.at(index).get('IS_CHECKED').patchValue(false);
      }
    }
  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }

  formPaymentChange(event: IPayment) {
    this.formPayment = event;
    let balancePrice = this.balancePriceState - (event.totalPaymentPrice ? event.totalPaymentPrice : 0);
    this.formGroup.patchValue({
      paymentPrice: event.paymentPrice,
      discountPrice: event.discountPrice,
      totalPaymentPrice: event.paymentPrice,
      accBankId: event.accBankId,
      paymentDate: event.paymentDate,
      documentRef: event.documentRef,
      balancePrice: balancePrice
    });
  }

  get paymentMoreThenBalancePrice(): boolean {
    return this.formGroup.get('totalPaymentPrice').value > this.balancePriceState
  }

  onSubmit() {
    let f = { ...this.formGroup.value };
    f = {
      clNo: f.clNo,
      alNo: f.alNo,
      refundId: f.refundId,
      refundName: f.refundName,
      balancePrice: f.balancePrice,
      paymentPrice: f.paymentPrice,
      discountPrice: f.discountPrice,
      totalPaymentPrice: f.paymentPrice,
      accBankId: f.accBankId,
      paymentDate: f.paymentDate,
      documentRef: f.documentRef,
      netPrice: f.netPrice,
      bankCode: f.bankCode,
      paymentType: f.paymentType,
      branchId: f.branchId,
      createDate: getDateMyDatepicker(f.createDate),
      createBy: f.createBy,
      remark: f.remark,
    }

    this.s_loader.showLoader();
    const url = `${appConfig.apiUrl}/Ris/Cl`;
    this.http.post(url, f).pipe(
      finalize(() => this.s_loader.onEnd())
    ).subscribe(() => {
      toastr.success(message.created);
      this.formGroup.reset();
      this.loadingAlList();
    }, () => toastr.error(message.failed));

  }

}
