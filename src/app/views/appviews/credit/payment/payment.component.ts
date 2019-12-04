import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'app/services/credit/payment.service';
import { Payment, ContractItem, Contract, Booking, IsPay, IsOutstanding, PaymentFG } from 'app/models/credit/payment';
import { setLocalDate, currencyToFloat, setZeroHours, appConfig } from 'app/app.config';
import { UserService } from '../../../../services/users';
import { message } from 'app/app.message';
import { DropDownModel } from 'app/models/drop-down-model';
import * as $ from 'jquery';
import { IUserResCookie } from 'app/interfaces/users';
import { PaymentTypeList, PaymentType } from 'app/entities/general.entities';
import { IPayment } from 'app/interfaces/payment.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ExpenseOtherService } from 'app/services/ris/expense-other.service';
import { ContractItemModel } from 'app/models/credit/contract-item-model';
import { mergeMap, map } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { ContractService } from 'app/services/credit/contract.service';
import { IContractTransactionReceipt } from 'app/models/credit';

declare var toastr: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent implements OnInit, OnDestroy {

  user: IUserResCookie;
  asyncUser: any;
  notPayment = 13; // ยังไม่ชำระ

  CurrencyToFloat = currencyToFloat;
  PaymentType = PaymentType;
  PaymentTypeList = PaymentTypeList;
  setLocalDate = setLocalDate
  checkSelectPaymentItem: boolean = true;
  contractModel: Contract = new Contract();
  bookingModel: Booking = new Booking();
  isPayModel: IsPay = new IsPay();
  isOutstandingModel: IsOutstanding = new IsOutstanding();
  contractItemModel: ContractItem[] = [];
  receiptList: IContractTransactionReceipt[] = [];
  debitTable = new BehaviorSubject<ContractItemModel[]>([]);
  bankingsDropdown = new Array<DropDownModel>();
  statusDropdown = new Array<DropDownModel>();
  dataTable: any;

  // expenses: any[] = [];

  formGroup: FormGroup;

  PaymentData = new BehaviorSubject(null);
  formPayment: IPayment;
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
  ) {
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
    this.user = this._userService.cookies;
  }

  ngOnInit() {
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

    // this.s_expense.GetAll().subscribe(x => {
    //   this.expenses = x.filter(o => o.expensesType == EXPT.Expenses);
    // });

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
      };
    });

    this.formGroup.get('paymentType').valueChanges.subscribe(x => {
      this.setFormPaymentType(this.formGroup.get('totalPrice').value);
    })

    this.PaymentData.next(this.paymentData);
  }

  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  destroyDatatable() {
    if (this.dataTable) {
      this.dataTable.destroy()
      this.dataTable = null
    }
  }

  private initDatatable(): void {
    let table: any = $('table.set-dataTable');
    this.dataTable = table.DataTable({
      scrollX: true,
      scrollCollapse: true
    });
  }

  private reInitDatatable(): void {
    this.destroyDatatable();
    setTimeout(() => this.initDatatable(), 0)
  }

  loadCreditPayment(item: Payment) {
    this.contractModel = item.contract;
    this.contractModel.contractDate = setLocalDate(item.contract.contractDate);
    this.bookingModel = item.booking;
    this.isPayModel = item.isPay ? item.isPay : new IsPay();
    this.isOutstandingModel = item.isOutstanding ? item.isOutstanding : new IsOutstanding();

    this.instalmentCount = 0;
    this.contractItemModel = [];

    item.contractItem.map(res => {
      this.contractItemModel.push({
        isSlect: false,
        taxInvoiceNo: res.taxInvoiceNo,
        contractItemId: res.contractItemId,
        contractId: item.contract.contractId,
        instalmentNo: res.instalmentNo,
        dueDate: res.dueDate,
        payDate: res.payDate,
        balanceNetPrice: res.balanceNetPrice,
        payNetPrice: res.payNetPrice,
        paymentType: res.paymentType,
        fineSum: res.fineSum || 0,
        fineSumRemain: res.fineSumRemain || 0,
        fineSumOther: res.fineSumOther || 0,
        remark: res.remark,
        payeer: this.user.id.toString(),
        status: res.status,
        statusDesc: res.statusDesc,
        remainNetPrice: res.remainNetPrice
      })
    });

    this.chRef.markForCheck();

    const outstandingPrice = this.contractItemModel
      .reduce((accumulator, current) => {
        return accumulator + (current.remainNetPrice + current.fineSumRemain + current.fineSumOther);
      }, 0)

    this.formGroup.patchValue({
      contractId: item.contract.contractId,
      payeer: this.user.id.toString(),
      updateBy: this.user.id.toString(),
      branchId: this.user.branch,
      payDate: null,
      outstanding: outstandingPrice
    })

    this.reInitDatatable();
    this.chRef.detectChanges();
  }

  instalmentCount: number = 0;
  setFormPayment() {
    this.instalmentCount = this.contractItemModel
      .filter(item => item.isSlect == true)
      .length;

    let fineSumRemain = 0;
    const balanceNetPrice = this.contractItemModel
      .filter(item => item.isSlect == true)
      .reduce((accumulator, current) => {
        fineSumRemain += current.fineSumRemain;
        return accumulator + (current.remainNetPrice);
      }, 0);

    this.formGroup.patchValue({
      fineSum: fineSumRemain,
      balanceNetPrice: balanceNetPrice,
      payNetPrice: balanceNetPrice,
      totalPrice: balanceNetPrice + fineSumRemain,
      payDate: null
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
    const creditContractItem = this.contractItemModel
      .filter(x => x.isSlect == true)
      .map(x => {
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
      payDate: f.paymentDate,
      creditContractItem
    };

    if (confirm('ยืนยันการรับชำระหรือไม่?')) {
      this._paymentService.PaymentTerm(frm).subscribe((x) => {
        toastr.success(message.created);
        // this.loadCreditPayment(x);
        setTimeout(() => {
          location.reload();
        }, 400);
      }, () => {
        toastr.error(message.failed);
      });
    }
  }

  onCanclePayment() {
    if (confirm('ยืนยันการยกเลิกการทำรายการรับชำระหรือไม่')) {
      this.router.navigate(['credit/contract-list/active'])
    }
  }

  onCancel(contractItemId: string, instalmentNo: number) {
    const instalment = instalmentNo == 0 ? 'ค่างวด' : `ครั้งที่ ${instalmentNo}`;
    const p = prompt(`ยืนยันการยกเลิกรายการรับชำระ ${instalment} หรือไม่\nระบุหมายเหตุ:`);
    if (p === '') {
      alert('กรุณาระบุหมายเหตุของการยกเลิก!')
    } else if (p !== '' && p !== null) {
      const params = {
        contractItemId: contractItemId,
        remark: p,
        updateBy: this.user.id.toString()
      }
      this._paymentService.CancelContractTerm(params).subscribe(() => {
        toastr.success(message.canceled);
        // setTimeout(() => {
        //   this.reInitDatatable();
        // }, 500);
        setTimeout(() => location.reload(), 800);
      }, (err) => {
        toastr.error(err);
      })
    }
  }

  onPrintTax(value: any) {
    window.open(`${appConfig.apikkWeb}/php/print_tax_3.php?booking_id=${value.bookingId}&tax_inv_no=${value.taxInvNo}`);
  }

  onPrintReceipt(value: any) {
    window.open(`${appConfig.apikkWeb}/php/print_receive_3.php?booking_id=${value.bookingId}&receipt_no=${value.receiptNo}`);
  }

  changeSelectPaymentItem() {
    let select = this.contractItemModel.filter(x => x.isSlect == true);
    const instalmentNo = select.map(x => x.instalmentNo);
    this.formGroup.patchValue({ instalmentNo });
    this.checkSelectPaymentItem = select.length > 0 ? false : true;
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
    // - disCountPrice;
    // x.disCountRate = (disCountPrice * 100) / payNetPrice;
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

}
