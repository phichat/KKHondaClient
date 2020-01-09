import { Component, OnInit } from '@angular/core';
import { FormCancelSlipConfig, IFormCancelSlip } from '../../../components/cancel-slip';
import { UserService } from 'app/services/users';

@Component({
  selector: 'app-form-cancel-booking',
  templateUrl: '../../../components/cancel-slip/form-cancel-slip.component.html'
})

export class FormCancelBookingComponent extends FormCancelSlipConfig implements IFormCancelSlip, OnInit {

  constructor(
    private s_user: UserService
    ) {
    super();
    this.user = this.s_user.cookies;
  }

  ngOnInit(): void {
    this.onConfirmCancel(false);
  }

  onCancel(): void {
    const valid = this.validCancelFormGroup.value;
    // const api1 = this.s_user.LeaderValidate(valid.gid, valid.userName, valid.password);
    // api1.subscribe(x => {
    //   const data = { ...this.cancelFormGroup.getRawValue(), approveId: x }
    //   const api2 = this.s_sale.CancelCommisstion(data);
    //   api2.subscribe(() => {
    //     toastr.success(message.canceled);
    //     setTimeout(() => location.reload(), 400);
    //   }, () => {
    //     toastr.error(message.cancelFail)
    //   });

    // }, (x: HttpErrorResponse) => {
    //   if (x.status == 403) {
    //     toastr.error(message.validateFail);
    //   } else {
    //     toastr.error(x.statusText);
    //   }
    // });
  }
  onConfirmCancel(value: boolean): void {
    let reason = this.cancelFormGroup.get('reason');
    if (value) {
      reason.disable();
    } else {
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