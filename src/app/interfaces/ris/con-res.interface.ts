import { IConItemRes } from './con-item-res.interface';
import { IConItemDocRes } from './con-item-doc.interface';

export interface IConRes {
    bookingId: number;
    bookingNo: string;
    bookingStatus: number;
    statusDesc: string;
    state1?: number;
    state2?: number;
    eNo: string;
    fNo: string;
    price1: number;
    vatPrice1: number;
    price2: number;
    totalPrice: number;
    cutBalance: number;
    createBy: number;
    createName: string;
    createDate: Date;
    updateBy?: number;
    updateName: string;
    updateDate?: Date;
    branchId: number;
    transportReceiptDate: Date;
    transportServiceCharge: number;
    branchName: string;
    branchProvince: string;
    tagNo: string;
    province: string;
    tagRegis?: Date;
    reason: string;
    remark: string;

    sedNo: string;
}

export interface ICarRegisItemRes {
    carRegisListItemRes: IConItemRes[];
    carRegisListItemDocRes: IConItemDocRes[];
}