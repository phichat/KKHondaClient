export interface IClDeposit {
  insuranceCode: string;
  paymentType: number;
  paymentPrice: number;
  discount: number;
  totalPaymentPrice: number;
  paymentDate?: Date;
  expenseTag: string;
  accBankId?: number;
  documentRef: string;
  status: number;
  branchId: number;
  createBy: number;
  reason: string;
  remark: string;
}

export interface IClDepositDetail {
  expenseTag: string;
  insuranceCode: string;
  insuranceName: string;
  paymentType: number;
  paymentPrice: number;
  discount: number;
  totalPaymentPrice: number;
  paymentDate?: Date;
  accBankId?: number;
  bankName: string;
  accBankNumber: string;
  accBankName: string;
  documentRef: string;
  status: number;
  statusDesc: string;
  branchId: number;
  createBy: number;
  createName: string;
  reason: string;
  remark: string;
  conList: ICarRegisClDeposit[];
}

export interface ICarRegisClDeposit {
  bookingId: number;
  bookingNo: string;
  bookingDate: Date;
  netPrice1: number;
  expense: number;
  paymentPrice: number;
}

export interface IClDepositRes {
  id: number;
  listBookingId: string;
  expenseTag: string;
  expenseTagName: string;
  insuranceCode: string;
  insuranceName: string;
  receiptNo: string;
  receiptDate?: Date;
  totalNetPrice1: number;
  totalExpense: number;
  totalPrice: number;
  paymentType: number;
  paymentTypeDesc: string;
  paymentPrice: number;
  discount: number;
  totalPaymentPrice: number;
  paymentDate?: Date;
  accBankId?: number;
  bankName: string;
  documentRef: string;
  status: number;
  statusDesc: string;
  branchId: number;
  branchName: string;
  createBy: number;
  createName: string;
  createDate: Date;
  updateBy?: number;
  updateName: string;
  updateDate?: Date;
  reason: string;
  remark: string;
}

export interface IClDepositCancel {
  id: number;
  updateBy: number;
  reason: string;
}