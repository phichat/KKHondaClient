import { ISedRes } from './sed-res.interface';

export interface IRevListRes {
    revId: number;
    revNo: string;
    sedNo: string;
    sedCreateName: string;
    branchId: number;
    branchName: string;
    totalPrice1: number;
    totalVatPrice1: number;
    totalNetPrice: number;
    totalCutBalance: number;
    totalPrice2: number;
    totalIncome: number;
    totalClBalancePrice: number;
    totalClReceivePrice: number;
    totalExpenses: number;
    totalAccruedExpense: number;
    remark: string;
    status: number;
    statusDesc: string;
    createBy: number;
    CreateName: string;
    createDate: Date;
    updateBy?: number;
    updateName: string;
    updateDate?: Date;
}

export interface IRevWithSedItem {
    revItem: IRevListRes;
    sedItem: ISedRes
}