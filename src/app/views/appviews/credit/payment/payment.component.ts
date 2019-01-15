import { Component, OnInit, AfterViewInit, ElementRef, ChangeDetectorRef, DoCheck } from '@angular/core';
import * as Inputmask from 'inputmask';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'app/services/credit/payment.service';
import { Payment, ContractItem, Contract, Booking, IsPay, IsOutstanding, PaymentFG } from 'app/models/credit/payment';
import { HttpErrorResponse } from '@angular/common/http';
import { setLocalDate, resetLocalDate, currencyToFloat } from 'app/app.config';
import { PageloaderService } from '../../pageloader/pageloader.component';
import { ModelUser } from '../../../../models/users';
import { UserService } from '../../../../services/users';
import { message } from 'app/app.message';
import { DropDownModel } from 'app/models/drop-down-model';
import * as $ from 'jquery';

declare var toastr: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {

  user = new ModelUser();
  asyncUser: any;
  notPayment = 13; // ยังไม่ชำระ

  setLocalDate = setLocalDate
  checkSelectPaymentItem: boolean = true;
  contractItemModel: ContractItem[] = [];
  contractModel: Contract = new Contract();
  bookingModel: Booking = new Booking();
  isPayModel: IsPay = new IsPay();
  isOutstandingModel: IsOutstanding = new IsOutstanding();
  paymentModel: PaymentFG = new PaymentFG();
  bankingsDropdown = new Array<DropDownModel>();
  dataTable: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _paymentService: PaymentService,
    private pageloader: PageloaderService,
    private chRef: ChangeDetectorRef,
    private _userService: UserService,
    private router: Router,
  ) {
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
  }

  ngOnInit() {

    this._activatedRoute.params.subscribe(async param => {
      if (param['id']) {
        await this._paymentService.GetByContractId(param['id'])
          .subscribe((res) => {
            const x = <Payment>res.json()
            this.loadCreditPayment(x);

            this.chRef.detectChanges();

            const table: any = $('table');
            this.dataTable = table.DataTable({
              scrollX: true,
              scrollY: '50vh',
              scrollCollapse: true,
              paging: false,
              searching: false,
              info: false
            });
          });

        this.asyncUser = this._userService.currentData;
        this._userService.currentData.subscribe(u => {
          this.user = u;
        });

      };
    })
  }

  async loadCreditPayment(item: Payment) {
    this.contractModel = item.contract;
    this.contractModel.contractDate = setLocalDate(item.contract.contractDate);
    this.bookingModel = item.booking;
    this.isPayModel = item.isPay ? item.isPay : new IsPay();
    this.isOutstandingModel = item.isOutstanding ? item.isOutstanding : new IsOutstanding();
    this.bankingsDropdown = item.bankingsDropdown;

    this.instalmentCount = 0;
    this.contractItemModel = [];
    this.paymentModel = new PaymentFG();

    await item.contractItem.map(res => {
      this.contractItemModel.push({
        isSlect: false,
        taxInvoiceNo: res.taxInvoiceNo,
        contractItemId: res.contractItemId,
        contractId: item.contract.contractId,
        instalmentNo: res.instalmentNo,
        dueDate: (res.dueDate),
        payDate: (res.payDate),
        balanceNetPrice: res.balanceNetPrice,
        payNetPrice: res.payNetPrice,
        paymentType: res.paymentType,
        fineSum: res.fineSum || 0,
        fineSumRemain: res.fineSumRemain || 0,
        fineSumeOther: res.fineSumeOther || 0,
        remark: res.remark,
        payeer: this.user.id.toString(),
        status: res.status,
        statusDesc: res.statusDesc,
        remainNetPrice: res.remainNetPrice
      })
    });

    // let contractItem = this.contractItemModel.filter(item => item.payDate == null)[0];
    const outstandingPrice = this.contractItemModel
      .filter(item => item.payDate == null)
      .reduce((accumulator, current) => {
        return accumulator + (current.balanceNetPrice + current.fineSumRemain + current.fineSumeOther);
      }, 0)

    this.paymentModel.contractId = item.contract.contractId;
    this.paymentModel.payeer = this.user.id.toString();
    this.paymentModel.updateBy = this.user.id.toString();
    this.paymentModel.branchId = this.user.branch;
    this.paymentModel.payDate = (new Date()).toISOString();
    this.paymentModel.outstanding = outstandingPrice;
    // this.paymentModel.balanceNetPrice = 0;
    // this.paymentModel.payNetPrice = 0;
    // this.paymentModel.totalPrice = 0;
    // this.paymentModel.fineSume = 0;
    // this.paymentModel.dueDate = contractItem ? contractItem.dueDate : null;
    // this.paymentModel.disCountPrice = 0.00;
    // this.paymentModel.disCountRate = 0.00;
  }

  ngAfterViewInit() {
    const number2Digit = document.querySelectorAll('input.number-2-digit');
    Inputmask({
      'alias': 'numeric',
      'groupSeparator': ',',
      'autoGroup': true,
      'digits': 2
    }).mask(number2Digit);
  }

  instalmentCount: number = 0;
  setFormPayment() {
    this.instalmentCount = this.contractItemModel
      .filter(item => item.status == this.notPayment && item.isSlect == true)
      .length;

    let fineSumRemain = 0;
    const balanceNetPrice = this.contractItemModel
      .filter(item => item.payDate == null && item.isSlect == true)
      .reduce((accumulator, current) => {
        fineSumRemain += current.fineSumRemain;
        return accumulator + (current.balanceNetPrice);
      }, 0);

    this.paymentModel.fineSume = fineSumRemain;
    this.paymentModel.balanceNetPrice = balanceNetPrice;
    this.paymentModel.payNetPrice = balanceNetPrice;
    this.paymentModel.totalPrice = balanceNetPrice + fineSumRemain;
  }

  async onSubmit(value: any) {
    if (this.paymentModel.outstanding == 0) {
      return;
    }
    const frm = {
      ContractId: this.paymentModel.contractId,
      FineSum: currencyToFloat(this.paymentModel.fineSume.toString()),
      FineSumOther: currencyToFloat(this.paymentModel.fineSumeOther.toString()),
      PayNetPrice: currencyToFloat(this.paymentModel.payNetPrice.toString()),
      DisCountPrice: currencyToFloat(this.paymentModel.disCountPrice.toString()),
      DiscountRate: this.paymentModel.disCountRate,
      PaymentType: this.paymentModel.paymentType,
      BankCode: this.paymentModel.bankCode,
      DocumentRef: this.paymentModel.documentRef,
      Remark: this.paymentModel.remark,
      PayDate: this.paymentModel.payDate,
      BranchId: this.paymentModel.branchId,
      UpdateBy: this.paymentModel.updateBy,
      CreditContractItem: this.contractModel
    }

    if (confirm('ยืนยันการรับชำระหรือไม่?')) {

      this.pageloader.setShowPageloader(true);

      // this.paymentModel.payDate = resetLocalDate(this.paymentModel.payDate);
      // this.paymentModel.dueDate = resetLocalDate(this.paymentModel.dueDate);
      this.paymentModel.payNetPrice = currencyToFloat(this.paymentModel.payNetPrice.toString());

      await this._paymentService.PaymentTerm(frm).subscribe((res) => {
        toastr.success('บันทึกรายการสำเร็จ!');
        this.loadCreditPayment(res);
      }, (err: HttpErrorResponse) => {
        toastr.error(err.statusText);
      })

      this.pageloader.setShowPageloader(false)
    }
  }

  onCanclePayment() {
    if (confirm('ยืนยันการยกเลิกการทำรายการรับชำระหรือไม่')) {
      this.router.navigate(['credit/contract-list/active'])
    }
  }

  onCancel(contractItemId: string, instalmentNo: number) {
    const p = prompt(`ยืนยันการยกเลิกรายการรับชำระ ครั้งที่ ${instalmentNo} หรือไม่\nระบุหมายเหตุ:`);
    if (p === '') {
      alert('กรุณาระบุหมายเหตุของการยกเลิก!')
    } else if (p !== '' && p !== null) {
      const params = {
        contractItemId: contractItemId,
        remark: p,
        updateBy: this.user.id.toString()
      }
      this._paymentService.CancelContractTerm(params).subscribe(res => {
        const x = <Payment>res.json();
        toastr.success(message.canceled);
        this.loadCreditPayment(x);
      }, (err: HttpErrorResponse) => {
        toastr.error(message.error);
      })
    }
  }

  onPrint(value: any) {

    if (value.invoice) {
      window.open(`http://203.154.126.61/KK-Honda-Web/backoffice/php/print_tax_3.php?booking_id=${value.bookingId}&contract_item_id=${value.contractItemId}`)

    }

    if (value.receipt) {
      window.open(`http://203.154.126.61/KK-Honda-Web/backoffice/php/print_receive_3.php?booking_id=${value.bookingId}&contract_item_id=${value.contractItemId}`);
    }
  }

  changeSelectPaymentItem() {
    let select = this.contractItemModel
      .filter(x => x.isSlect == true && x.balanceNetPrice == x.remainNetPrice);
    this.checkSelectPaymentItem = select.length > 0 ? false : true;
  }

  // changeFineSum() {
  //   const payNetPrice = this.paymentModel.payNetPrice ? currencyToFloat(this.paymentModel.payNetPrice.toString()) : 0;
  //   const fineSum = this.paymentModel.fineSume ? currencyToFloat(this.paymentModel.fineSume.toString()) : 0;
  //   const fineSumOther = this.paymentModel.fineSumeOther ? currencyToFloat(this.paymentModel.fineSumeOther.toString()) : 0;
  //   this.paymentModel.totalPrice = payNetPrice + fineSum + fineSumOther
  // }

  onCalculate() {
    const payNetPrice = this.paymentModel.payNetPrice ? currencyToFloat(this.paymentModel.payNetPrice.toString()) : 0;
    const fineSum = this.paymentModel.fineSume ? currencyToFloat(this.paymentModel.fineSume.toString()) : 0;
    const fineSumOther = this.paymentModel.fineSumeOther ? currencyToFloat(this.paymentModel.fineSumeOther.toString()) : 0;
    const disCountPrice = this.paymentModel.disCountPrice ? currencyToFloat(this.paymentModel.disCountPrice.toString()) : 0;

    this.paymentModel.totalPrice = (payNetPrice + fineSum + fineSumOther) - disCountPrice;
    this.paymentModel.disCountRate = (disCountPrice * 100) / payNetPrice;
  }
}
