import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import * as Inputmask from 'inputmask';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'app/services/credit/payment.service';
import { Payment, ContractItem, Contract, Booking, IsPay, IsOutstanding, PaymentFG } from 'app/models/credit/payment';
import { HttpErrorResponse } from '@angular/common/http';
import { PageLoadWarpperService } from '../../../../services/common/page-load-warpper.service';

declare var toastr: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {

  userName: string = 'Admin'
  userId: string = '1';

  contractItemModel: ContractItem[] = [];
  contractModel: Contract = new Contract();
  bookingModel: Booking = new Booking();
  isPayModel: IsPay = new IsPay();
  isOutstandingModel: IsOutstanding = new IsOutstanding();
  paymentModel: PaymentFG = new PaymentFG();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _paymentService: PaymentService,
    private _pageWarpperService: PageLoadWarpperService
  ) {
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
  }

  ngOnInit() {

    this._activatedRoute.params.subscribe(async param => {
      if (param['id']) {
        await this._paymentService.GetByContractId(param['id']).subscribe(item => this.loadCreditPayment(item))
      };
    })

  }

  async loadCreditPayment(item: Payment) {
    this.contractModel = item.contract;
    this.bookingModel = item.booking;
    this.isPayModel = item.isPay;
    this.isOutstandingModel = item.isOutstanding;

    this.instalmentCount = 0;
    this.contractItemModel = [];
    this.paymentModel = new PaymentFG();

    await item.contractItem.map(res => {
      this.contractItemModel.push({
        isSlect: false,
        contractItemId: res.contractItemId,
        contractId: item.contract.contractId,
        instalmentNo: res.instalmentNo,
        taxInvoiceNo: res.taxInvoiceNo,
        dueDate: res.dueDate,
        payDate: res.payDate,
        balanceNetPrice: res.balanceNetPrice,
        payNetPrice: res.payNetPrice,
        paymentType: res.paymentType,
        fineSum: res.fineSum,
        remark: res.remark,
        payeer: this.userId
      })
    });

    let outstandingPrice = this.contractItemModel
      .filter(item => item.payNetPrice == null)
      .reduce((accumulator, current) => {
        return accumulator + current.balanceNetPrice;
      }, 0)

    let balanceNetPrice = this.contractItemModel.filter(item => item.payNetPrice == null)[0].balanceNetPrice;

    this.paymentModel.payDate = new Date();
    this.paymentModel.outstanding = outstandingPrice;
    this.paymentModel.balanceNetPrice = balanceNetPrice;
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
      .filter(item => item.payNetPrice == null && item.isSlect == true)
      .reduce((accumulator) => {
        return accumulator += 1;
      }, 0)

    let balanceNetPrice = this.contractItemModel
      .filter(item => item.payNetPrice == null && item.isSlect == true)
      .reduce((accumulator, current) => {
        return accumulator + current.balanceNetPrice;
      }, 0)
    this.paymentModel.payNetPrice = balanceNetPrice;
  }

  async onSubmit(value: any) {
    if (confirm('ยืนยันการรับชำระหรือไม่?')) {

      const payment = this.contractItemModel.filter(item => item.payNetPrice == null && item.isSlect == true);
      payment.map(item => {
        item.paymentType = this.paymentModel.paymentType;
        item.payDate = new Date();
      });

      await this._paymentService.PaymentTerm(payment).subscribe((res) => {
        toastr.success('บันทึกรายการสำเร็จ!');
        this.loadCreditPayment(res);
      }, (err: HttpErrorResponse) => {
        toastr.error(err.statusText);
      })

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
        updateBy: this.userId
      }
      this._paymentService.CancelContractTerm(params).subscribe(item => {
        toastr.success('ยกเลิกรายการสำเร็จ!');
        this.loadCreditPayment(item);
      }, (err: HttpErrorResponse) => {
        toastr.error(err.statusText);
      })
    }
  }
}
