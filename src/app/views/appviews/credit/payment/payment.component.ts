import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'app/services/credit/payment.service';
import { Payment, IsPay, IsOutstanding, PaymentFG, ContractItem } from 'app/models/credit/payment';
import { setLocalDate, setZeroHours, appConfig } from 'app/app.config';
import { UserService } from '../../../../services/users';
import { message } from 'app/app.message';
import { IPayment } from 'app/interfaces/payment.interface';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { ContractService } from 'app/services/credit/contract.service';
import { PaymentConfig } from './payment.config';
import { ReasonService } from 'app/services/masters/reason.service';
import { HttpErrorResponse } from '@angular/common/http';

declare var toastr: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent extends PaymentConfig implements OnInit, OnDestroy {

  private paymentData: IPayment = {
    paymentPrice: null,
    options: {
      invalid: true,
      disabled: false
    }
  };

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _paymentService: PaymentService,
    private chRef: ChangeDetectorRef,
    private _userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private s_contract: ContractService,
    private s_reason: ReasonService,
  ) {
    super();
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
    this.user = this._userService.cookies;

    this.cancelFormGroup = this.fb.group({
      contractId: new FormControl(null, Validators.required),
      receiptNo: new FormControl(null, Validators.required),
      reason: new FormControl(null, Validators.required),
      approveBy: new FormControl(null),
      confirm: new FormControl(false)
    });

    this.validCancelFormGroup = this.fb.group({
      gid: new FormControl(null, Validators.required),
      userName: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
    this.instalmentGroup = this.fb.group({
      instalment: this.fb.array([])
    });

    this.formGroup = this.fb.group({
      contractId: new FormControl(null, Validators.required),
      outstanding: new FormControl(null),
      dueDate: new FormControl(null),
      payDate: new FormControl(null),
      revenueStamp: new FormControl(null),
      payNetPrice: new FormControl(null, Validators.required),
      fineSum: new FormControl(null),
      fineSumOther: new FormControl(null),
      payeer: new FormControl(this.user.id, Validators.required),
      balanceNetPrice: new FormControl(null, Validators.required),
      remark: new FormControl(null),
      updateBy: new FormControl(this.user.id, Validators.required),
      branchId: new FormControl(this.user.branchId, Validators.required),
      totalPrice: new FormControl(null, Validators.required),
      status: new FormControl(null),

      cutBalance: new FormControl(null),
      discountInterest: new FormControl(null),

      instalmentNo: new FormControl(null),
      paymentName: new FormControl(null),
      paymentType: new FormControl('1', Validators.required),
      paymentPrice: new FormControl(null, Validators.required),
      discountPrice: new FormControl(null),
      totalPaymentPrice: new FormControl(null, Validators.required),
      accBankId: new FormControl(null),
      paymentDate: new FormControl(null, Validators.required),
      documentRef: new FormControl(null),

    });

    this._activatedRoute.params.subscribe(param => {
      if (param['id']) {
        const api1 = this._paymentService.GetByContractId(param['id']);
        const api2 = this._paymentService.GetReceiptByContractId(param['id']);
        const api3 = this.s_contract.GetContractItem(param['id']);

        const observe = combineLatest(api1, api2, api3).pipe(
          map(x => {
            return { payment: x[0], receipt: x[1], contractItem: x[2] }
          })
        );

        observe.subscribe(x => {
          this.chRef.markForCheck();
          this.loadCreditPayment(x.payment);
          this.debitTable.next(x.contractItem);
          this.receiptList = x.receipt;
        });

        this.reasonDropdown = this.s_reason.DropDown();
      };
    });

    this.formGroup.get('paymentType').valueChanges.subscribe(x => {
      this.setFormPaymentType(this.formGroup.get('totalPrice').value);
    });

    this.PaymentData.next(this.paymentData);
  }

  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  loadCreditPayment(item: Payment) {
    this.contractModel = item.contract;
    this.contractModel.contractDate = setLocalDate(item.contract.contractDate);
    this.bookingModel = item.booking;
    this.isPayModel = item.isPay ? item.isPay : new IsPay();
    this.isOutstandingModel = item.isOutstanding ? item.isOutstanding : new IsOutstanding();

    this.instalmentCount = 0;
    this.chRef.markForCheck();
    const contractItem = item.contractItem.map(res => {
      return {
        ...res,
        isSelect: false,
        fineSum: res.fineSum | 0,
        fineSumRemain: res.fineSumRemain | 0,
        fineSumOther: res.fineSumOther | 0,
        payeer: this.user.id.toString()
      }
    });

    this.setItemFormArray(contractItem, this.instalmentGroup, 'instalment');
    this.reInitDatatable();

    const outstandingPrice = contractItem
      .reduce((a, c) => a += (c.remainNetPrice + c.fineSumRemain + c.fineSumOther), 0)

    this.formGroup.patchValue({
      contractId: item.contract.contractId,
      status: item.contract.contractStatus,
      payeer: this.user.id.toString(),
      updateBy: this.user.id.toString(),
      branchId: this.user.branch,
      outstanding: outstandingPrice
    });
    this.cancelFormGroup.patchValue({
      contractId: item.contract.contractId
    });
    this.chRef.detectChanges();
  }

  private setItemFormArray(array: ContractItem[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const firstItem = array.sort((a, b) => a.instalmentNo - b.instalmentNo)[0];
      // disable checkbox ถ้ายังไม่ชำระเงินดาวน์
      const itemFGs = array.map(item => {
        const disabledCheckbox = (firstItem.status != 11 && item.instalmentNo != 0)
        return this.fb.group({
          ...item,
          isSelect: new FormControl({ value: item.isSelect, disabled: disabledCheckbox })
        })
      });
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }

  instalmentCount: number = 0;
  setFormPayment() {
    const instalmentNo = this.InstalmentListIsSelect.map(x => x.instalmentNo);
    let fineSumRemain = 0;
    const balanceNetPrice = this.InstalmentListIsSelect
      .reduce((accumulator, current) => {
        fineSumRemain += current.fineSumRemain;
        return accumulator + (current.remainNetPrice);
      }, 0);

    this.formGroup.patchValue({
      fineSum: fineSumRemain,
      balanceNetPrice: balanceNetPrice,
      payNetPrice: balanceNetPrice,
      totalPrice: balanceNetPrice + fineSumRemain,
      cutBalance: null,
      discountInterest: null,
      instalmentNo
    });

    this.setFormPaymentType(this.formGroup.get('totalPrice').value);
  }

  setFormPaymentType(x: number) {
    this.formPayment = {
      ...this.formPayment,
      paymentPrice: x
    }
    this.PaymentData.next(this.formPayment);
  }

  onSubmit() {
    let f = { ...this.formGroup.getRawValue() } as PaymentFG;
    if (f.outstanding == 0) return;

    f.payDate = setZeroHours(f.payDate);
    let creditContractItem = this.InstalmentListIsSelect.map(x => {
      return {
        instalmentNo: x.instalmentNo,
        contractItemId: x.contractItemId,
        contractId: x.contractId,
        fineSum: x.fineSum,
        fineSumRemain: x.fineSumRemain
      }
    });

    const frm = {
      ...f,
      fineSum: f.fineSum || 0,
      fineSumOther: f.fineSumOther || 0,
      discountPrice: f.discountPrice || 0,
      revenueStamp: f.revenueStamp || 0,
      cutBalance: f.cutBalance || 0,
      discountInterest: f.discountInterest || 0,
      payDate: f.paymentDate,
      creditContractItem
    };

    if (confirm('ยืนยันการรับชำระหรือไม่?')) {
      this._paymentService.PaymentTerm(frm).subscribe((x) => {
        toastr.success(message.created);
        setTimeout(() => location.reload(), 400);
      }, () => {
        toastr.error(message.failed);
      });
    }
  }

  onCanclePayment() {
    this.router.navigate(['credit/contract-list/active'])
  }

  onCancel() {
    const valid = this.validCancelFormGroup.value;
    const api1 = this._userService.LeaderValidate(valid.gid, valid.userName, valid.password);
    api1.subscribe(x => {
      const param = { ...this.cancelFormGroup.getRawValue(), approveBy: x }
      const api2 = this._paymentService.CancelContractTerm(param);
      api2.subscribe(o => {
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

  onConfirmCancel(value: boolean) {
    let receiptNo = this.cancelFormGroup.get('receiptNo');
    let reason = this.cancelFormGroup.get('reason');
    if (value) {
      receiptNo.disable();
      reason.disable();
    } else {
      receiptNo.enable();
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
    // this.chRef.detectChanges();
    // const params = {
    //   contractItemId: frm.contractItemId,
    //   reason: frm.reason,
    //   updateBy: this.user.id.toString()
    // }
    // this._paymentService.CancelContractTerm(params).subscribe(() => {
    //   toastr.success(message.canceled);
    //   setTimeout(() => location.reload(), 400);
    // }, (err) => {
    //   toastr.error(err);
    // })
  }

  onPrintTax(value: any) {
    window.open(`${appConfig.apikkWeb}/php/print_tax_3.php?booking_id=${value.bookingId}&tax_inv_no=${value.taxInvNo}`);
  }

  onPrintReceipt(value: any) {
    window.open(`${appConfig.apikkWeb}/php/print_receive_3.php?booking_id=${value.bookingId}&receipt_no=${value.receiptNo}`);
  }

  onCalculate() {
    let x = this.formGroup.value;
    const payNetPrice = x.payNetPrice | 0;
    const fineSum = x.fineSum | 0;
    const fineSumOther = x.fineSumOther | 0;
    const revenueStamp = x.revenueStamp | 0;
    const totalPrice = (revenueStamp + payNetPrice + fineSum + fineSumOther);
    this.formGroup.patchValue({ totalPrice });
    this.setFormPaymentType(totalPrice);
  }

  getTime(d: Date): number {
    return (new Date(d)).getTime();
  }

  formPaymentChange(event: IPayment) {
    this.formPayment = event;
    this.formGroup.patchValue({
      paymentPrice: event.paymentPrice,
      discountPrice: event.discountPrice,
      totalPaymentPrice: event.paymentPrice,
      accBankId: event.accBankId || null,
      paymentDate: event.paymentDate,
      documentRef: event.documentRef
    });
  }

  contractClosing() {
    this.debitTable.subscribe(x => {
      this.setFormPayment();

      const instalmentList = this.InstalmentList.value as ContractItem[];
      const item = instalmentList
        .filter(o => o.status != 11)
        .sort((a, b) => a.instalmentNo - b.instalmentNo)[0];

      const discountInterest = x.find(o => o.instalmentNo == item.instalmentNo).discountInterest;
      let cutBalance = instalmentList.reduce((a, c) => a += c.remainNetPrice, 0);
      cutBalance -= discountInterest;

      this.formGroup.patchValue({
        cutBalance,
        discountInterest,
        payNetPrice: cutBalance
      });

      for (let i = 0; i < instalmentList.length; i++) {
        if (instalmentList[i].status != 11) {
          this.InstalmentList.at(i).patchValue({
            isSelect: true
          })
        }
      }
      this.onCalculate();
    })
  }

  undoContractClosing() {
    this.formGroup.patchValue({
      cutBalance: null,
      discountInterest: null,
      payNetPrice: null
    });
    const instalmentList = this.InstalmentList.value as ContractItem[];
    for (let i = 0; i < instalmentList.length; i++) {
      if (instalmentList[i].status != 11) {
        this.InstalmentList.at(i).patchValue({
          isSelect: false
        })
      }
    }
    this.onCalculate();
  }

}
