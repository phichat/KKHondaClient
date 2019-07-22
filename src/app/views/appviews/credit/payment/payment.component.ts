import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'app/services/credit/payment.service';
import { Payment, ContractItem, Contract, Booking, IsPay, IsOutstanding, PaymentFG } from 'app/models/credit/payment';
import { setLocalDate, currencyToFloat, setZeroHours, MyDatePickerOptions, getDateMyDatepicker } from 'app/app.config';
import { ModelUser } from '../../../../models/users';
import { UserService } from '../../../../services/users';
import { message } from 'app/app.message';
import { DropDownModel } from 'app/models/drop-down-model';
import * as $ from 'jquery';

declare var toastr: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {

  user = new ModelUser();
  asyncUser: any;
  notPayment = 13; // ยังไม่ชำระ

  CurrencyToFloat = currencyToFloat;
  myDatePickerOptions = MyDatePickerOptions;

  setLocalDate = setLocalDate
  checkSelectPaymentItem: boolean = true;
  contractModel: Contract = new Contract();
  bookingModel: Booking = new Booking();
  isPayModel: IsPay = new IsPay();
  isOutstandingModel: IsOutstanding = new IsOutstanding();
  paymentModel: PaymentFG = new PaymentFG();
  contractItemModel: ContractItem[] = [];
  bankingsDropdown = new Array<DropDownModel>();
  statusDropdown = new Array<DropDownModel>();
  dataTable: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _paymentService: PaymentService,
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
        this._paymentService.GetByContractId(param['id'])
          .subscribe((res) => {
            this.loadCreditPayment(res);
          });

        this.asyncUser = this._userService.currentData;
        this._userService.currentData.subscribe(u => {
          this.user = u;
        });

      };
    })
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
    let table: any = $('table');
    this.dataTable = table.DataTable({
      scrollX: true,
      // scrollY: '50vh',
      scrollCollapse: true,
      // paging: false,
      // searching: false,
      // info: false
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
    this.bankingsDropdown = item.bankingsDropdown;
    // this.statusDropdown = item.statusDropdown;

    this.instalmentCount = 0;
    this.contractItemModel = [];
    this.paymentModel = new PaymentFG();

    item.contractItem.map(res => {
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

    this.chRef.markForCheck();

    // setTimeout(() => {
    //   this.reInitDatatable();
    // }, 500);

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

    this.reInitDatatable();
    this.chRef.detectChanges();
  }

  ngAfterViewInit() {
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
    this.paymentModel.payDate = { myDate: null };
  }

  onSubmit(value: any) {
    let f = Object.assign({}, this.paymentModel) as PaymentFG;
    if (f.outstanding == 0) return;

    f.payDate = getDateMyDatepicker(f.payDate).toISOString();
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

    const frm = { ...f, creditContractItem };

    if (confirm('ยืนยันการรับชำระหรือไม่?')) {
      this._paymentService.PaymentTerm(frm).subscribe((x) => {
        toastr.success(message.canceled);

        this.loadCreditPayment(x);
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
