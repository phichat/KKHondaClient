export interface ISedRes {
    sedId: number;
    sedNo: string;
    conList: string;
    price1: number;
    vatPrice1: number;
    netPrice1: number;
    price2: number;
    price3?: number;
    price2Remain: number;
    totalPrice: number;
    borrowMoney: number;
    status: number;
    statusDesc: string;
    branchId: number;
    branchName: string;
    createBy: number;
    createName: string;
    createDate: Date;
    updateBy: number;
    updateName: string;
    updateDate: Date;
    reason: string;
    remark: string;
}