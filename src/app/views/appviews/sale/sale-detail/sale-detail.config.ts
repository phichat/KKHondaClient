
import { UserDropdownModel } from 'app/models/users/user-dropdown-model';
import { IMAmpher, IMProvince } from 'app/interfaces/masters';
import { ContractModel, SaleModel } from 'app/models/credit';
import { BookingModel } from 'app/models/selling';
import { DropDownModel } from 'app/models/drop-down-model';
import { CustomerModel } from 'app/models/customers';
import { BookingPaymentTypeList, BookingPaymentType } from 'app/entities/mcs.entities';
import { setLocalDate } from 'app/app.config';
import { Observable } from 'rxjs';

export class SaleDetailConfig {
  bookingModel = new BookingModel();
  contractModel = new ContractModel();
  saleModel = new SaleModel();
  iboxShow = true;
  setLocalDate = setLocalDate;
  BookingPaymentTypeList = BookingPaymentTypeList;
  BookingPaymentType = BookingPaymentType;

  SaleBy: Observable<UserDropdownModel>;
  Owner: Observable<CustomerModel>;
  OwnerAmphor: Observable<IMAmpher>;
  OwnerProvince: Observable<IMProvince>;
  Hire: Observable<CustomerModel>;
  HireAmphor: Observable<IMAmpher>;
  HireProvince: Observable<IMProvince>;
  reasonDropdown: Observable<DropDownModel[]>;

  listSlip: any[] = [];

  sellSlip = { modalId: 'cancelSell', title: 'ใบขาย' };
  reserveReturnSlip = { modalId: 'cancelReserveReturn', title: 'ใบคืนเงินมัดจำ' };
  receiptSlip = { modalId: 'cancelReceipt', title: 'ใบเสร็จรับเงิน' };
  invTaxRecSlip = { modalId: 'cancelinvTaxRec', title: 'ใบส่งของ/ใบกำกับภาษี/ใบเสร็จรับเงิน' };
  invTaxSlip = { modalId: 'cancelinvTax', title: 'ใบส่งของ/ใบกำกับภาษี' };
  comSlip = { modalId: 'cancelCom', title: 'ใบส่งเสริมการขาย' };
}