export interface IAlRes {
    alId: number;
    alNo: string;
    sedNo: string;
    borrowerName: string;
    balancePrice: number;
    receivePrice: number;
    netPrice: number;
    paymentPrice: number;
    price2Remain: number;
    paymentType?: number;
    bankCode: string;
    bankName: string;
    documentRef: string;
    remark: string;
    status?: number;
    statusDesc: string;
    branchId: number;
    branchName: string;
    createDate: Date;
    createBy: number;
    createName: string;
    updateDate?: Date;
    updateBy?: number;
    updateName: string;
    reason: string;
}