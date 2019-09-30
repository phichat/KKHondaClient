export interface IConItemRes {
    runId: number;
    bookingId: number;
    bookingNo: string;
    itemCode: string;
    itemName: string;
    itemPrice1: number;
    itemVatPrice1: number;
    itemCutBalance: number;
    itemPrice2?: number;
    itemPrice3?: number;
    itemPriceTotal: number;
    state?: string | number;
    dateReceipt?: any;
    remark: string;
}

export interface IConItemOutput {
    conNo: string;
    state1?: number;
    state2?: number;
    cutBalance?: number;
}