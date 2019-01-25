import { DropDownModel } from '../drop-down-model';

export class Payment {
    contract: Contract;
    booking: Booking;
    isPay: IsPay;
    isOutstanding: IsOutstanding;
    contractItem: ContractItem[];
    statusDropdown: DropDownModel[];
    bankingsDropdown: DropDownModel[];
}

export class PaymentFG {
    contractId: number;
    outstanding: number;
    paymentType: number;
    dueDate: any;
    payDate: any;
    payNetPrice: number;
    fineSume: number;
    fineSumeOther: number;
    payeer: string;
    balanceNetPrice: number;
    remark: string;
    updateBy: string;
    branchId: number;
    documentRef: string;
    disCountPrice: number;
    disCountRate: number;
    totalPrice: number;
    status: number;
    bankCode: string;
}

export class Contract {
    contractId: number;
    calculateId: number;
    bookingId: number;
    refNo: string;
    contractNo: string;
    contractDate: any;
    statusDesc: string;
    contractHire: string;
    saleName: string;
    remark: string;
}

export class Booking {
    engineNo: string;
    frameNo: string;
    brandName: string;
    modelCode: string;
    color: string;
    price: number;
    bookingPaymentType: number;
    depositPrice: number;
    depositIsPay: number;
    depositIsOutstanding: number;
}

export class IsPay {
    isPayPrice: number;
    isPayTerm: number;
}

export class IsOutstanding {
    isOutstandingPrice: number;
    isOutstandingTerm: number;
}

export class ContractItem {
    isSlect: boolean;
    contractItemId: number;
    contractId: number;
    taxInvoiceNo: string;
    instalmentNo: number;
    dueDate: Date;
    payDate: Date;
    balanceNetPrice: number;
    payNetPrice: number; 
    paymentType: number;
    fineSum: number;
    fineSumRemain: number;
    fineSumeOther: number;
    remark: string;
    payeer: string;
    status: number;
    statusDesc: string;
    remainNetPrice: number;
}