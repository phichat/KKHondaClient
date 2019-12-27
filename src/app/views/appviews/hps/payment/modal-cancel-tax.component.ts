import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { IUserResCookie } from 'app/interfaces/users';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'app/services/users';
import { PaymentService } from 'app/services/credit/payment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { message } from 'app/app.message';
import { Observable } from 'rxjs';
import { DropDownModel } from 'app/models/drop-down-model';
import { ITax } from './tax.interface';

declare var toastr: any;

@Component({
  selector: 'app-modal-cancel-tax',
  templateUrl: 'modal-cancel-tax.component.html'
})

export class ModalCancelTaxComponent implements OnInit {

  @Input() contractId: number = 0;
  @Input() taxList: ITax[] = [];
  @Input() reasonDropdown: Observable<DropDownModel[]>;

  user: IUserResCookie;

  cancelTaxInvFormGroup = new FormGroup({
    contractId: new FormControl(null, Validators.required),
    slipNo: new FormControl(null, Validators.required),
    reason: new FormControl(null, Validators.required),
    approveBy: new FormControl(null),
    confirm: new FormControl(false)
  });

  validCancelTaxInvFormGroup = new FormGroup({
    gid: new FormControl(null, Validators.required),
    userName: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  });

  constructor(
    private s_user: UserService,
    private s_payment: PaymentService,
  ) {
    this.user = this.s_user.cookies;
  }

  ngOnInit() {
  }

  onCancelTaxInv() {
    const valid = this.validCancelTaxInvFormGroup.value;
    const api1 = this.s_user.LeaderValidate(valid.gid, valid.userName, valid.password);
    api1.subscribe(x => {
      const param = { ...this.cancelTaxInvFormGroup.getRawValue(), approveBy: x }
      const api2 = this.s_payment.CancelTaxInvNo(param);
      api2.subscribe(() => {
        toastr.success(message.canceled);
        setTimeout(() => location.reload(), 400);
      }, () => {
        toastr.error(message.cancelFail)
      });

    }, (x: HttpErrorResponse) => {
      if (x.status == 403) {
        toastr.error('ชื่อผู้ใช้ หรือ รหัสผ่าน ไม่ถูกต้อง');
      } else {
        toastr.error(x.statusText);
      }
    });
  }

  onConfirmCancelTaxInv(value: boolean) {
    let taxInvNo = this.cancelTaxInvFormGroup.get('slipNo');
    let reason = this.cancelTaxInvFormGroup.get('reason');
    if (value) {
      taxInvNo.disable();
      reason.disable();
    } else {
      taxInvNo.enable();
      reason.enable();
    }
    if (!value) {
      this.validCancelTaxInvFormGroup.reset();
      this.validCancelTaxInvFormGroup.patchValue({
        branchId: this.user.branchId
      });
    }
    this.cancelTaxInvFormGroup.patchValue({
      confirm: value
    });
  }
}