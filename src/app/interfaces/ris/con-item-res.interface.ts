export interface IConItemRes {
    runId: number;
    bookingId: number;
    bookingNo: string;
    itemCode: string;
    itemName: string;
    itemTag: string;
    itemType?: number;
    itemPrice1?: number;
    itemVatPrice1?: number;
    itemNetPrice1?: number;
    itemCutBalance?: number;
    itemPrice2?: number;
    itemPrice3?: number;
    itemPriceTotal?: number;
    state?: any;
    paymentStatus?: number;
    paymentPrice?: number;
    dateReceipt?: any;
    remark: string;
}

export interface IConItem {
    runId: number;
    bookingId?: number;
    itemCode: string;
    itemName: string;
    itemTag: string;
    itemType?: number;
    itemPrice1?: number;
    itemVatPrice1?: number;
    itemNetPrice1?: number;
    itemCutBalance?: number;
    itemPrice2?: number;
    itemPrice3?: number;
    itemPriceTotal?: number;
    state?: number;
    paymentStatus?: number;
    paymentPrice?: number;
    dateReceipt?:  Date | string;
    remark: string;
}

export interface IConItemOutput {
    conNo: string;
    state1?: number;
    state2?: number;
    cutBalance?: number;
}