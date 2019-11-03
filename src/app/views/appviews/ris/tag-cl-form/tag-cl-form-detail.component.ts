import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ModelUser } from 'app/models/users';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { DropDownModel } from 'app/models/drop-down-model';
import { appConfig } from 'app/app.config';
import { TagClConfig } from './tag-cl.config';
import { LoaderService } from 'app/core/loader/loader.service';
import { finalize, mergeMap, tap, mapTo } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ReasonService } from 'app/services/masters';
import { IPayment } from 'app/interfaces/payment.interface';

declare var toastr: any;
@Component({
  selector: 'app-tag-cl-form-detail',
  templateUrl: './tag-cl-form-detail.component.html'
})
export class TagClFormDetailComponent extends TagClConfig implements OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private s_user: UserService,
    private chRef: ChangeDetectorRef,
    private s_loader: LoaderService,
    private s_reason: ReasonService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
    this.mUser = this.s_user.cookies;
    this.s_reason.DropDown().subscribe(x => this.reasonDropdown = x);
  }
  PaymentData = new BehaviorSubject(null);

  ngOnInit() {
    this.formGroup = this.fb.group({
      clNo: new FormControl(null),
      alNo: new FormControl(null),
      revNo: new FormControl(null),
      refundId: new FormControl(null),
      refundName: new FormControl(null),
      balancePrice: new FormControl(null),
      paymentPrice: new FormControl(null),
      discountPrice: new FormControl(null),
      totalPaymentPrice: new FormControl(null),
      netPrice: new FormControl(null),
      accBankId: new FormControl(null),
      paymentDate: new FormControl(null),
      documentRef: new FormControl(null),
      paymentType: new FormControl({value:null, disabled: true}),
      branchId: new FormControl(null),
      createDate: new FormControl(null),
      createBy: new FormControl(null),
      createName: new FormControl(null),
      updateDate: new FormControl(null),
      updateBy: new FormControl(this.mUser.id, Validators.required),
      remark: new FormControl(null),
      reason: new FormControl(null, Validators.required),
      status: new FormControl(null),
      statusDesc: new FormControl(null),
      AlList: this.fb.array([])
    });

    this.loadingAlList();
  }

  loadingAlList() {
    this.activeRoute.params.subscribe(x => {
      const GetByClNo = `${appConfig.apiUrl}/Ris/Cl/GetByClNo`;
      const GetByAlNo = `${appConfig.apiUrl}/Ris/Al/GetByAlNo`;
      const params = { clNo: x['code'] }
      this.http.get(GetByClNo, { params })
        .pipe(
          mergeMap((al) => {
            const getConNo = (p: any) => this.http.get(GetByAlNo, { params: { alNo: al['alNo'] } })
              .pipe(
                tap(al => p['AlList'] = [al]),
                mapTo(p)
              );
            return getConNo(al);
          })
        ).subscribe((o: any) => {
          const paymentDate: IPayment = {
            paymentPrice: o.paymentPrice,
            discountPrice: o.discount,
            totalPaymentPrice: o.totalPaymentPrice,
            paymentDate: o.paymentDate,
            accBankId: o.accBankId,
            documentRef: o.documentRef,
            options: {
              invalid: false,
              disabled: true
            }
          };
          this.PaymentData.next(paymentDate);

          this.formGroup.patchValue({
            clNo: o.clNo,
            alNo: o.alNo,
            refundName: o.refundName,
            balancePrice: o.balancePrice,
            paymentPrice: o.paymentPrice,
            discountPrice: o.discountPrice,
            totalPaymentPrice: o.totalPaymentPrice,
            paymentDate: o.paymentDate,
            netPrice: o.netPrice,
            accBankId: o.accBankId,
            documentRef: o.documentRef,
            paymentType: o.paymentType.toString(),
            remark: o.remark,
            reason: o.reason,
            status: o.status,
            statusDesc: o.statusDesc,
            createDate: o.createDate,
            createName: o.createName
          })
          if (!o['AlList'].length) { this.loading = 1; return }
          const res = o['AlList'].reduce((a, c) => [...a, { ...c, IS_CHECKED: true }], []);
          this.setItemFormArray(res, this.formGroup, 'AlList');
          this.chRef.markForCheck();

          this.reInitDatatable();
        }, () => this.loading = 2);
    })

  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }

  onSubmit() {
    if (!confirm('ยืนยันการยกเลิกการคืนเงิน หรือไม่?')) return;
    let f = { ...this.formGroup.value };
    f = {
      clNo: f.clNo,
      reason: f.reason,
      updateBy: f.updateBy,
      remark: f.remark
    }

    this.s_loader.showLoader();
    const url = `${appConfig.apiUrl}/Ris/Cl/Cancel`;
    this.http.post(url, f).pipe(
      finalize(() => this.s_loader.onEnd())
    ).subscribe(() => {
      toastr.success(message.created);
      this.router.navigate(['ris/cl-list']);
    }, () => toastr.error(message.failed));

  }

  printCl() {
    const url = `${appConfig.reportUrl}/RIS/index.aspx?clNo=${this.formGroup.get('clNo').value}&userId=${this.formGroup.get('updateBy').value}&formCl=true`;
    window.open(url, '_blank');
  }
}
