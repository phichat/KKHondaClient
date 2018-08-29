export class Payment {
    contract: Contract;
    booking: Booking;
    isPay: IsPay;
    isOutstanding: IsOutstanding;
    contractItem: ContractItem[];
}

export class PaymentFG {
    instalmentNo: number;
    refNo: string;
    taxInvoiceNo: string;
    outstanding: number;
    paymentType: number;
    payDate: Date;
    payNetPrice: number;
    balanceNetPrice: number;
    fineSum: number;
    remark: string;
    updateBy: string;
}

export class Contract {
    contractId: number;
    calculateId: number;
    bookingId: number;
    refNo: string;
    contractNo: string;
    contractDate: Date;
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
    instalmentNo: number;
    taxInvoiceNo: string;
    dueDate: Date;
    payDate: Date;
    balanceNetPrice: number;
    payNetPrice: number; 
    paymentType: number;
    fineSum: number;
    remark: string;
    payeer: string;
}