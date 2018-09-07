import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import * as Inputmask from 'inputmask';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'app/services/credit/payment.service';
import { Payment, ContractItem, Contract, Booking, IsPay, IsOutstanding, PaymentFG } from 'app/models/credit/payment';
import { HttpErrorResponse } from '@angular/common/http';
import { PageLoadWarpperService } from '../../../../services/common/page-load-warpper.service';
import { setLocalDate, resetLocalDate, currencyToFloat } from 'app/app.config';
import { PageloaderService } from '../../pageloader/pageloader.component';
import { ModelUser } from '../../../../models/users';
import { UserService } from '../../../../services/users';

declare var toastr: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {

  user = new ModelUser();

  contractItemModel: ContractItem[] = [];
  contractModel: Contract = new Contract();
  bookingModel: Booking = new Booking();
  isPayModel: IsPay = new IsPay();
  isOutstandingModel: IsOutstanding = new IsOutstanding();
  paymentModel: PaymentFG = new PaymentFG();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _paymentService: PaymentService,
    private pageloader: PageloaderService,
    private _userService: UserService
  ) {
    this._userService.currentData.subscribe(u => this.user = u);
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
    this.contractModel.contractDate = setLocalDate(item.contract.contractDate);
    this.bookingModel = item.booking;
    this.isPayModel = item.isPay ? item.isPay : new IsPay();
    this.isOutstandingModel = item.isOutstanding ? item.isOutstanding : new IsOutstanding();

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
        dueDate: setLocalDate(res.dueDate),
        payDate: setLocalDate(res.payDate),
        balanceNetPrice: res.balanceNetPrice,
        payNetPrice: res.payNetPrice,
        paymentType: res.paymentType,
        fineSum: res.fineSum,
        remark: res.remark,
        payeer: this.user.id.toString()
      })
    });

    let outstandingPrice = this.contractItemModel
      .filter(item => item.payDate == null)
      .reduce((accumulator, current) => {
        return accumulator + current.balanceNetPrice;
      }, 0)

    let contractItem = this.contractItemModel.filter(item => item.payDate == null)[0];

    this.paymentModel.contractId = item.contract.contractId;
    this.paymentModel.payeer = this.user.id.toString();
    this.paymentModel.updateBy = this.user.id.toString();
    this.paymentModel.branchId = this.user.branch;
    this.paymentModel.payDate = setLocalDate((new Date()).toISOString());
    this.paymentModel.outstanding = outstandingPrice;
    this.paymentModel.balanceNetPrice = contractItem ? contractItem.balanceNetPrice : 0.00;
    this.paymentModel.payNetPrice = this.paymentModel.balanceNetPrice;
    this.paymentModel.dueDate = contractItem ? contractItem.dueDate : null;
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
  // setFormPayment() {
  //   this.instalmentCount = this.contractItemModel
  //     .filter(item => item.payNetPrice == null && item.isSlect == true)
  //     .reduce((accumulator) => {
  //       return accumulator += 1;
  //     }, 0)

  //   let balanceNetPrice = this.contractItemModel
  //     .filter(item => item.payNetPrice == null && item.isSlect == true)
  //     .reduce((accumulator, current) => {
  //       return accumulator + current.balanceNetPrice;
  //     }, 0)
  //   this.paymentModel.payNetPrice = balanceNetPrice;
  // }

  async onSubmit(value: any) {
    if (confirm('ยืนยันการรับชำระหรือไม่?')) {

      this.pageloader.setShowPageloader(true);

      this.paymentModel.payDate = resetLocalDate(this.paymentModel.payDate);
      this.paymentModel.dueDate = resetLocalDate(this.paymentModel.dueDate);
      this.paymentModel.payNetPrice = currencyToFloat(this.paymentModel.payNetPrice.toString());


      await this._paymentService.PaymentTerm(this.paymentModel).subscribe((res) => {
        toastr.success('บันทึกรายการสำเร็จ!');
        this.loadCreditPayment(res);
      }, (err: HttpErrorResponse) => {
        toastr.error(err.statusText);
      })

      this.pageloader.setShowPageloader(false)
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
      this._paymentService.CancelContractTerm(params).subscribe(item => {
        toastr.success('ยกเลิกรายการสำเร็จ!');
        this.loadCreditPayment(item);
      }, (err: HttpErrorResponse) => {
        toastr.error(err.statusText);
      })
    }
  }

  onPrint(value: any) {
    console.log(value);
  }
}
