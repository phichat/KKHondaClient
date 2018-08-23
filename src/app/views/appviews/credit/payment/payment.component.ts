import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Inputmask from 'inputmask';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'app/services/credit/payment.service';
import { Payment, ContractItem, Contract, Booking, IsPay, IsOutstanding, PaymentFG } from 'app/models/credit/payment';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {

  userName: string = 'Admin'
  contractItemModel: ContractItem[];
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
        await this._paymentService.GetByContractId(param['id']).subscribe(item => {
          this.contractModel = item.contract;
          this.contractItemModel = item.contractItem;
          this.bookingModel = item.booking;
          this.isPayModel = item.isPay;
          this.isOutstandingModel = item.isOutstanding;
        })
      };
    })
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

  setFormPayment(instalmentNo: number) {
    const outstandingPrice = this.contractItemModel
      .filter(item => item.payNetPrice == null)
      .reduce((accumulator, current) => {
        return accumulator + current.balanceNetPrice;
      }, 0)

    this.contractItemModel
      .filter(item => item.instalmentNo == instalmentNo)
      .map((item: ContractItem) => {
        this.paymentModel.instalmentNo = item.instalmentNo;
        this.paymentModel.refNo = this.contractModel.refNo;
        this.paymentModel.taxInvoiceNo = item.taxInvoiceNo;
         this.paymentModel.outstanding = outstandingPrice;
        this.paymentModel.paymentType = item.paymentType;
        this.paymentModel.payDate = !item.payDate ? (new Date()) : item.payDate;
        this.paymentModel.payNetPrice = item.balanceNetPrice;
        this.paymentModel.remark = item.remark;
      })
  }

  onSubmit(value: any) {
  console.log('====================================');
  console.log(value);
  console.log('====================================');
  }
}
