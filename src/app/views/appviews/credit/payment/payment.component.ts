import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import * as Inputmask from 'inputmask';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'app/services/credit/payment.service';
import { Payment, ContractItem, Contract, Booking, IsPay, IsOutstanding, PaymentFG } from 'app/models/credit/payment';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Outstanding } from '../../../../models/credit/outstanding-model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {

  userName: string = 'Admin'
  contractItemModel: ContractItem[] = [];
  contractModel: Contract = new Contract();
  bookingModel: Booking = new Booking();
  isPayModel: IsPay = new IsPay();
  isOutstandingModel: IsOutstanding = new IsOutstanding();
  paymentModel: PaymentFG = new PaymentFG();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _paymentService: PaymentService
  ) { }

  ngOnInit() {

    this.paymentModel.payDate = new Date();
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
        remark: res.remark,
        payeer: res.payeer
      })
    });

    let outstandingPrice = this.contractItemModel
      .filter(item => item.payNetPrice == null)
      .reduce((accumulator, current) => {
        return accumulator + current.balanceNetPrice;
      }, 0)

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

  onSubmit(value: any) {
    if (confirm('ยืนยันการรับชำระหรือไม่?')) {
      // const payment = this.contractItemModel.filter(item => item.payNetPrice == null && item.isSlect == true);
      const payment = {
        contractItemId: 1,
        contractId: 1,
        payeer: 1,
        payDate: (new Date()).toISOString(),
        paymentType: 1
      }
      this._paymentService.PaymentTerm(payment).subscribe(item => {
        this.loadCreditPayment(item);
      })
    }
  }

  onCancel(contrictItemId: string, instalmentNo: number) {
    const p = prompt(`ยืนยันการยกเลิกรายการรับชำระ ครั้งที่ ${instalmentNo} หรือไม่\nระบุหมายเหตุ:`);
    if (p === '') {
      alert('กรุณาระบุหมายเหตุของการยกเลิก!')
    } else if (p !== '' && p !== null) {
      this._paymentService.CancelContractTerm(contrictItemId).subscribe(item => {
        this.loadCreditPayment(item);
      })
    }
  }
}
