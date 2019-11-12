export interface IPayment {
  paymentPrice: number;
  discountPrice?: number;
  totalPaymentPrice?: number;
  accBankId?: number;
  paymentDate?: Date | string;
  documentRef?: string;
  options: {
    invalid: boolean;
    disabled?: boolean;
  }
}

export interface IPaymentInput {
  paymentPrice: number;
  discountPrice?: number;
  totalPaymentPrice?: number;
  paymentDate?: Date;
  accBankId?: number;
  bankName?: string;
  accBankName?: string;
  accBankNumber?: string;
  documentRef?: string;
  options: {
    invalid: boolean;
    disabled?: boolean;
  }
}