import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { IUserResCookie } from 'app/interfaces/users';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { HttpErrorResponse } from '@angular/common/http';
import { PaymentService } from 'app/services/credit/payment.service';
import { IReceipt } from './receipt.interface';
import { Observable } from 'rxjs';
import { DropDownModel } from 'app/models/drop-down-model';

declare var toastr: any;

@Component({
  selector: 'app-modal-cancel-receipt',
  templateUrl: 'modal-cancel-receipt.component.html'
})

export class ModalCancelReceiptComponent implements OnInit {

  @Input() contractId: number = 0;
  @Input() receiptList: IReceipt[] = [];
  @Input() reasonDropdown: Observable<DropDownModel[]>;

  user: IUserResCookie;

  cancelReceiptFormGroup = new FormGroup({
    contractId: new FormControl(null, Validators.required),
    slipNo: new FormControl(null, Validators.required),
    reason: new FormControl(null, Validators.required),
    approveBy: new FormControl(null),
    confirm: new FormControl(false)
  });

  validCancelReceiptFormGroup = new FormGroup({
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

  onCancelReceipt() {
    const valid = this.validCancelReceiptFormGroup.value;
    const api1 = this.s_user.LeaderValidate(valid.gid, valid.userName, valid.password);
    api1.subscribe(x => {
      const param = { ...this.cancelReceiptFormGroup.getRawValue(), approveBy: x }
      const api2 = this.s_payment.CancelReceiptNo(param);
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

  onConfirmCancelReceipt(value: boolean) {
    let receiptNo = this.cancelReceiptFormGroup.get('slipNo');
    let reason = this.cancelReceiptFormGroup.get('reason');
    if (value) {
      receiptNo.disable();
      reason.disable();
    } else {
      receiptNo.enable();
      reason.enable();
    }
    if (!value) {
      this.validCancelReceiptFormGroup.reset();
      this.validCancelReceiptFormGroup.patchValue({
        branchId: this.user.branchId
      });
    }
    this.cancelReceiptFormGroup.patchValue({
      confirm: value
    });
  }
}