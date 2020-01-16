import { Component, Input } from '@angular/core';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { HttpErrorResponse } from '@angular/common/http';
import { FormCancelSlipConfig, FormCancelSlip2Config, ICancelSlip } from '../../../components/cancel-slip';
import { Observable } from 'rxjs/Observable';
import { DropDownModel } from 'app/models/drop-down-model';
import { PaymentService } from 'app/services/credit/payment.service';

declare var toastr: any;

@Component({
  selector: 'app-form-cancel-tax',
  templateUrl: '../../../components/cancel-slip/form-cancel-slip-2.component.html'
})

export class FormCancelTaxComponent extends FormCancelSlipConfig implements FormCancelSlip2Config {
  @Input() title: string;
  @Input() slipList: Observable<ICancelSlip[]>;
  @Input() reasonDropdown: Observable<DropDownModel[]>;

  constructor(
    private s_user: UserService,
    private s_payment: PaymentService,
  ) {
    super();
    this.user = this.s_user.cookies;
  }

  onCancel() {
    const valid = this.validCancelFormGroup.value;
    const api1 = this.s_user.LeaderValidate(valid.gid, valid.userName, valid.password);
    api1.subscribe(x => {
      const data = { ...this.cancelFormGroup.getRawValue(), approveId: x }
      const api2 = this.s_payment.CancelTaxInvNo(data);
      api2.subscribe(() => {
        toastr.success(message.canceled);
        setTimeout(() => location.reload(), 400);
      }, () => {
        toastr.error(message.cancelFail)
      });

    }, (x: HttpErrorResponse) => {
      if (x.status == 403) {
        toastr.error(message.validateFail);
      } else {
        toastr.error(x.statusText);
      }
    });
  }

  onConfirmCancel(value: boolean) {
    let slipNo = this.cancelFormGroup.get('slipNo');
    let reason = this.cancelFormGroup.get('reason');
    if (value) {
      slipNo.disable();
      reason.disable();
    } else {
      slipNo.enable();
      reason.enable();
    }
    if (!value) {
      this.validCancelFormGroup.reset();
      this.validCancelFormGroup.patchValue({
        branchId: this.user.branchId
      });
    }
    this.cancelFormGroup.patchValue({
      confirm: value
    });
  }
}