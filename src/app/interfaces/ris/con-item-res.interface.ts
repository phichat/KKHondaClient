export interface IConItemRes {
    runId: number;
    bookingId: number;
    bookingNo: string;
    itemCode: string;
    itemName: string;
    itemPrice1: number;
    itemVatPrice1: number;
    itemPrice2: number;
    itemPriceTotal: number;
    state?: number;
    dateReceipt?: Date;
    remark: string;
}