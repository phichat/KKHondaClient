export interface IPayment {
  paymentPrice?: number;
  discountPrice?: number;
  totalPaymentPrice?: number;
  bankCode?: string;
  paymentDate?: Date;
  invalid: boolean;
}