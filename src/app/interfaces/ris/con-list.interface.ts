export interface ICon {
    bookingId: number;
    bookingNo: string;
    status1?: number;
    status2?: number;
    state: number;
    eNo: string;
    fNo: string;
    price1?: number;
    vatPrice1?: number;
    cutBalance?: number;
    price2?: number;
    price3?: number;
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