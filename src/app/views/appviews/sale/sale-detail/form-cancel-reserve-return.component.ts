import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { HttpErrorResponse } from '@angular/common/http';
import { SaleService } from 'app/services/credit';
import { FormCancelSlipConfig, FormCancelSlip1Config } from '../../../components/cancel-slip';
import { Observable } from 'rxjs/Observable';
import { DropDownModel } from 'app/models/drop-down-model';

declare var toastr: any;

@Component({
  selector: 'app-form-cancel-reserve-return',
  templateUrl: '../../../components/cancel-slip/form-cancel-slip-1.component.html'
})

export class FormCancelReserveReturnComponent extends FormCancelSlipConfig implements FormCancelSlip1Config {
 @Input() title: string;
 @Input() slipNo: string;
 @Input() reasonDropdown: Observable<DropDownModel[]>;

  constructor(
    private s_user: UserService,
    private s_sale: SaleService,
  ) {
    super();
    this.user = this.s_user.cookies;
    this.cancelFormGroup.get('slipNo').disable();
  }

  onCancel() {
    const valid = this.validCancelFormGroup.value;
    const api1 = this.s_user.LeaderValidate(valid.gid, valid.userName, valid.password);
    api1.subscribe(x => {
      const data = { ...this.cancelFormGroup.getRawValue(), approveId: x }
      const api2 = this.s_sale.CancelReserveReturn(data);
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