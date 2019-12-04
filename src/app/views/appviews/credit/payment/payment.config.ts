
import { DropDownModel } from 'app/models/drop-down-model';
import { IUserResCookie } from 'app/interfaces/users';
import { PaymentTypeList, PaymentType } from 'app/entities/general.entities';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ContractItemModel } from 'app/models/credit/contract-item-model';
import { IContractTransactionReceipt } from 'app/models/credit';
import { setLocalDate, currencyToFloat } from 'app/app.config';
import { ContractItem, Contract, Booking, IsPay, IsOutstanding } from 'app/models/credit/payment';
import { FormGroup, FormArray } from '@angular/forms';
import { IPayment } from 'app/interfaces/payment.interface';
import * as $ from 'jquery';

export class PaymentConfig {
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

  formGroup: FormGroup;

  instalmentGroup: FormGroup;

  PaymentData = new BehaviorSubject(null);
  formPayment: IPayment;

  get InstalmentList(): FormArray {
    return this.instalmentGroup.get('instalment') as FormArray;
  }

  destroyDatatable() {
    if (this.dataTable) {
      this.dataTable.destroy()
      this.dataTable = null
    }
  }

  public initDatatable(): void {
    let table: any = $('table.set-dataTable');
    this.dataTable = table.DataTable({
      scrollX: true,
      scrollCollapse: true,
      searching: false,
      pageLength: 25,
    });
  }

  public reInitDatatable(): void {
    this.destroyDatatable();
    setTimeout(() => this.initDatatable(), 0)
  }
}