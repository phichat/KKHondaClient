import { Component, OnInit } from '@angular/core';
import { ReceiveDepositService } from 'app/services/ris';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'app/core/loader/loader.service';
import { tap, finalize } from 'rxjs/operators';
import { ReceiveDepositConfig } from './receive-deposit.config';
import { UserService } from 'app/services/users';
import { FormBuilder, FormControl } from '@angular/forms';
import { message } from 'app/app.message';
import { DropDownModel } from 'app/models/drop-down-model';
import { ReceiveClStatus } from 'app/entities/ris.entities';
import { IClDepositDetail, IClDepositCancel } from 'app/interfaces/ris';
import { BehaviorSubject } from 'rxjs';
import { ReasonService } from 'app/services/masters';
import { appConfig } from 'app/app.config';

declare var toastr: any;
@Component({
  selector: 'app-receive-deposit-detail',
  templateUrl: 'receive-deposit-detail.component.html'
})

export class ReceiveDepositDetailComponent extends ReceiveDepositConfig implements OnInit {
  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private s_clDeposit: ReceiveDepositService,
    private s_loader: LoaderService,
    private s_user: UserService,
    private s_reason: ReasonService,
    private fb: FormBuilder
  ) {
    super();
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
    this.mUser = this.s_user.cookies;
    this.formGroup = this.fb.group({
      receiptNo: new FormControl({ value: null, disabled: true }),
      expenseTag: new FormControl({ value: null, disabled: true }),
      insuranceName: new FormControl({ value: null, disabled: true }),
      paymentType: new FormControl({ value: null, disabled: true }),
      paymentPrice: new FormControl({ value: null, disabled: true }),
      discountPrice: new FormControl({ value: null, disabled: true }),
      totalPaymentPrice: new FormControl({ value: null, disabled: true }),
      bankCode: new FormControl({ value: null, disabled: true }),
      paymentDate: new FormControl({ value: null, disabled: true }),
      createBy: new FormControl({ value: null, disabled: true }),
      createName: new FormControl({ value: null, disabled: true }),
      updateBy: new FormControl(this.mUser.id),
      branchId: new FormControl({ value: null, disabled: true }),
      remark: new FormControl({ value: null, disabled: true }),
      reason: new FormControl(null),
      status: new FormControl(null),
      conList: this.fb.array([])
    });
    this.s_reason.DropDown().subscribe(o => this.reasonDropdown = o);
  }
  ReceiveClStatus = ReceiveClStatus;
  reasonDropdown: DropDownModel[];
  id: number;

  ngOnInit() {
    this.activeRoute.params.subscribe(o => {
      this.id = o['id'];

      this.s_clDeposit.GetDetailById(`${this.id}`)
        .pipe(tap(() => this.s_loader.show()))
        .subscribe((x: IClDepositDetail) => {

          this.formGroup.patchValue({ ...x, paymentType: `${x.paymentType}` });

          const paymentData = {
            paymentPrice: x.paymentPrice,
            discountPrice: x.discount,
            totalPaymentPrice: x.totalPaymentPrice,
            paymentDate: x.paymentDate,
            accBankId: x.accBankId,
            documentRef: x.documentRef,
            options: {
              invalid: false,
              disabled: true
            }
          }
          this.PaymentData.next(paymentData);

          if (!x.conList.length) {
            this.loading = this.LoadingEntities.noRecord;
          } else {
            this.checkedAll = true;
            x.conList.forEach(item => {
              const fg = this.fb.group({ IS_CHECKED: true, ...item });
              this.ConList.push(fg);
            });
            this.reInitDatatable();
          }
          this.s_loader.onEnd();
        }, () => toastr.error(message.error));
    });
  }

  onSubmit() {
    this.s_loader.showLoader()
    const f: IClDepositCancel = {
      id: this.id,
      updateBy: this.mUser.id,
      reason: this.formGroup.get('reason').value
    }
    this.s_clDeposit.Cancel(f)
      .pipe(finalize(() => this.s_loader.onEnd()))
      .subscribe(() => {
        toastr.success(message.canceled);
        this.route.navigate(['ris/receive-deposit-list']);
      }, () => toastr.error(message.failed));
  }

  print() {
    const receiptNo = this.formGroup.get('receiptNo').value;
    const url = `${appConfig.reportUrl}/RIS/index.aspx?clNo=${receiptNo}&formClDeposit=true`;
    window.open(url, '_blank');
  }
}