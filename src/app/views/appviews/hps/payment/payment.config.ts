
import { DropDownModel } from 'app/models/drop-down-model';
import { IUserResCookie } from 'app/interfaces/users';
import { PaymentTypeList, PaymentType } from 'app/entities/general.entities';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ContractItemModel } from 'app/models/credit/contract-item-model';
import { IContractTransactionReceipt } from 'app/models/credit';
import { setLocalDate, currencyToFloat } from 'app/app.config';
import { ContractItem, Contract, Booking, IsPay, IsOutstanding, PaymentFG } from 'app/models/credit/payment';
import { FormGroup, FormArray } from '@angular/forms';
import { IPayment } from 'app/interfaces/payment.interface';
import * as $ from 'jquery';
import { Observable } from 'rxjs';
import { GroupPage } from 'app/entities/group-page.entities';

export class PaymentConfig {
  user: IUserResCookie;
  asyncUser: any;
  notPayment = 13; // ยังไม่ชำระ

  GroupPage = GroupPage

  CurrencyToFloat = currencyToFloat;
  PaymentType = PaymentType;
  PaymentTypeList = PaymentTypeList;
  setLocalDate = setLocalDate
  // checkSelectPaymentItem: boolean = true;
  contractModel: Contract = new Contract();
  bookingModel: Booking = new Booking();
  isPayModel: IsPay = new IsPay();
  isOutstandingModel: IsOutstanding = new IsOutstanding();
  contractItemModel: ContractItem[] = [];
  receiptList: IContractTransactionReceipt[] = [];
  debitTable = new BehaviorSubject<ContractItemModel[]>([]);
  reasonDropdown: Observable<DropDownModel[]>;
  bankingsDropdown = new Array<DropDownModel>();
  statusDropdown = new Array<DropDownModel>();
  dataTable: any;

  formGroup: FormGroup;
  instalmentGroup: FormGroup;
  cancelFormGroup: FormGroup;
  validCancelFormGroup: FormGroup;

  PaymentData = new BehaviorSubject(null);
  formPayment: IPayment;

  contractItemId: number;
  promptMsg: string;

  get IsCutBalance(): boolean {
    const fg = this.formGroup.value as PaymentFG;
    return fg.cutBalance > 0 && fg.paymentPrice > fg.cutBalance;
  }

  get PaymentIncorrent(): boolean {
    const fg = this.formGroup.value as PaymentFG;
    const cutBalance = fg.paymentPrice > fg.cutBalance;
    const outstanding = fg.paymentPrice > fg.outstanding;
    return fg.cutBalance > 0 ? cutBalance : outstanding;
  }

  get IsNotDownPayment(): boolean {
    const contractItem = (this.InstalmentList.value as ContractItem[])
      .sort((a, b) => a.instalmentNo - b.instalmentNo)[0];
      
    if (!contractItem) return true;

    return contractItem.status != 11 ? true : false;
  }

  get InstalmentList(): FormArray {
    return this.instalmentGroup.get('instalment') as FormArray;
  }

  get InstalmentListIsSelect(): ContractItem[] {
    return (this.InstalmentList.value as ContractItem[]).filter(x => x.isSelect == true);
  }

  get IsSuccess(): boolean {
    const fg = this.formGroup.get('status').value;
    return fg == 29 || fg == 30;
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
      deferRender: true,
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