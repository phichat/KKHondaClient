export interface ICon {
    bookingId: number;
    bookingNo: string;
    bookingStatus: number;
    eNo: string;
    fNo: string;
    price1?: number;
    vatPrice1?: number;
    price2?: number;
    totalPrice?: number;
    createBy?: number;
    createDate?: Date;
    updateBy?: number;
    updateDate?: Date;
    branchId?: number;
    transportReceiptDate?: Date;
    transportServiceCharge?: number;
    reason: string;
    remark: string;
}