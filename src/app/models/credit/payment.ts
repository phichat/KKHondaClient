export class Payment {
    contract: Contract;
    booking: Booking;
    isPay: IsPay;
    isOutstanding: IsOutstanding;
    contractItem: ContractItem[];
}

export class PaymentFG {
    contractId: number;
    outstanding: number;
    paymentType: number;
    dueDate: any;
    payDate: any;
    payNetPrice: number;
    payeer: string;
    balanceNetPrice: number;
    remark: string;
    updateBy: string;
    branchId: number;
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
    dueDate: any;
    payDate: any;
    balanceNetPrice: number;
    payNetPrice: number; 
    paymentType: number;
    fineSum: number;
    remark: string;
    payeer: string;
}