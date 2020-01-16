
import { UserDropdownModel } from 'app/models/users/user-dropdown-model';
import { IMAmpher, IMProvince } from 'app/interfaces/masters';
import { ContractModel, SaleModel } from 'app/models/credit';
import { BookingModel } from 'app/models/selling';
import { DropDownModel } from 'app/models/drop-down-model';
import { CustomerModel } from 'app/models/customers';
import { BookingPaymentTypeList, BookingPaymentType } from 'app/entities/mcs.entities';
import { setLocalDate } from 'app/app.config';
import { Observable } from 'rxjs';
import { ICancelSlip } from 'app/views/components/cancel-slip';
import { IPrintSlip } from 'app/views/components/print-slip';

export class SaleDetailConfig {
  bookingModel = new BookingModel();
  contractModel = new ContractModel();
  saleModel = new SaleModel();
  iboxShow = true;
  setLocalDate = setLocalDate;
  BookingPaymentTypeList = BookingPaymentTypeList;
  BookingPaymentType = BookingPaymentType;

  receiptSlipList: Observable<ICancelSlip[]>;
  taxInvSlipList: Observable<ICancelSlip[]>;
  
  reasonList: Observable<DropDownModel[]>;
  SaleBy: Observable<UserDropdownModel>;
  Owner: Observable<CustomerModel>;
  OwnerAmphor: Observable<IMAmpher>;
  OwnerProvince: Observable<IMProvince>;
  Hire: Observable<CustomerModel>;
  HireAmphor: Observable<IMAmpher>;
  HireProvince: Observable<IMProvince>;

  listSlip: any[] = [];
  listReceiptAndTax: any[] = [];

  sellSlip = { modalId: 'Sell', title: 'ใบขาย' };
  reserveReturnSlip = { modalId: 'ReserveReturn', title: 'ใบคืนเงินมัดจำ' };
  receiptSlip = { modalId: 'Receipt', title: 'ใบเสร็จรับเงิน' };
  taxSlip = { modalId: 'Tax', title: 'ใบกำกับภาษี' };
  invTaxRecSlip = { modalId: 'invTaxRec', title: 'ใบส่งของ/ใบกำกับภาษี/ใบเสร็จรับเงิน' };
  invTaxSlip = { modalId: 'invTax', title: 'ใบส่งของ/ใบกำกับภาษี' };
  comSlip = { modalId: 'Com', title: 'ใบส่งเสริมการขาย' };
}