import { Component, OnInit, AfterViewInit, ElementRef, ChangeDetectorRef, DoCheck } from '@angular/core';
import * as Inputmask from 'inputmask';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'app/services/credit/payment.service';
import { Payment, ContractItem, Contract, Booking, IsPay, IsOutstanding, PaymentFG } from 'app/models/credit/payment';
import { HttpErrorResponse } from '@angular/common/http';
import { setLocalDate, resetLocalDate, currencyToFloat, setZeroHours } from 'app/app.config';
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

  CurrencyToFloat = currencyToFloat;

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
            this.onDetectTable();
          });

        this.asyncUser = this._userService.currentData;
        this._userService.currentData.subscribe(u => {
          this.user = u;
        });

      };
    })
  }

  onDetectTable() {

    let table: any = $('table');

    if ($.fn.DataTable.isDataTable('table')) {
        this.dataTable = table.DataTable();
        this.dataTable.destroy();
    }

    this.chRef.detectChanges();

    this.dataTable = table.DataTable({
      scrollX: true,
      scrollY: '50vh',
      scrollCollapse: true,
      paging: false,
      searching: false,
      info: false
    });

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

    const outstandingPrice = this.contractItemModel
      .reduce((accumulator, current) => {
        return accumulator + (current.remainNetPrice + current.fineSumRemain + current.fineSumeOther);
      }, 0)

    this.paymentModel.contractId = item.contract.contractId;
    this.paymentModel.payeer = this.user.id.toString();
    this.paymentModel.updateBy = this.user.id.toString();
    this.paymentModel.branchId = this.user.branch;
    this.paymentModel.payDate = setZeroHours(new Date());
    this.paymentModel.outstanding = outstandingPrice;
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
      .filter(item => item.isSlect == true)
      .length;

    let fineSumRemain = 0;
    const balanceNetPrice = this.contractItemModel
      .filter(item => item.isSlect == true)
      .reduce((accumulator, current) => {
        fineSumRemain += current.fineSumRemain;
        return accumulator + (current.remainNetPrice);
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
      contractId: this.paymentModel.contractId,
      fineSum: this.paymentModel.fineSume
        ? currencyToFloat(this.paymentModel.fineSume.toString())
        : 0,
      fineSumOther: this.paymentModel.fineSumeOther
        ? currencyToFloat(this.paymentModel.fineSumeOther.toString())
        : 0,
      payNetPrice: this.paymentModel.payNetPrice
        ? currencyToFloat(this.paymentModel.payNetPrice.toString())
        : 0,
      disCountPrice: this.paymentModel.disCountPrice
        ? currencyToFloat(this.paymentModel.disCountPrice.toString())
        : 0,
      discountRate: this.paymentModel.disCountRate || 0,
      paymentType: this.paymentModel.paymentType,
      bankCode: this.paymentModel.bankCode || null,
      documentRef: this.paymentModel.documentRef || null,
      remark: this.paymentModel.remark || null,
      payDate: this.paymentModel.payDate,
      branchId: this.paymentModel.branchId,
      updateBy: this.paymentModel.updateBy,
      creditContractItem: this.contractItemModel
        .filter(x => x.isSlect == true)
        .map(x => {
          return {
            instalmentNo: x.instalmentNo,
            contractItemId: x.contractItemId,
            contractId: x.contractId,
            fineSum: x.fineSum,
            fineSumRemain: x.fineSumRemain
          }
        })
    }

    if (confirm('ยืนยันการรับชำระหรือไม่?')) {

      await this._paymentService.PaymentTerm(frm).subscribe((x) => {
        let res = x.json();
        toastr.success('บันทึกรายการสำเร็จ!');
        this.loadCreditPayment(res);
        this.onDetectTable();

      }, (err: HttpErrorResponse) => {
        toastr.error(err.statusText);
      })
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
        // this.onDetectTable();
      }, (err) => {
        toastr.error(err);
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
      .filter(x => x.isSlect == true);
    this.checkSelectPaymentItem = select.length > 0 ? false : true;
  }

  onCalculate() {
    const payNetPrice = this.paymentModel.payNetPrice ? currencyToFloat(this.paymentModel.payNetPrice.toString()) : 0;
    const fineSum = this.paymentModel.fineSume ? currencyToFloat(this.paymentModel.fineSume.toString()) : 0;
    const fineSumOther = this.paymentModel.fineSumeOther ? currencyToFloat(this.paymentModel.fineSumeOther.toString()) : 0;
    const disCountPrice = this.paymentModel.disCountPrice ? currencyToFloat(this.paymentModel.disCountPrice.toString()) : 0;

    this.paymentModel.totalPrice = (payNetPrice + fineSum + fineSumOther) - disCountPrice;
    this.paymentModel.disCountRate = (disCountPrice * 100) / payNetPrice;
  }

  getTime(d: Date): number {
    return (new Date(d)).getTime();
  }
}
