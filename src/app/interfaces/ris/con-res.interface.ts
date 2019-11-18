import { IConItemRes } from './con-item-res.interface';
import { IConItemDocRes } from './con-item-doc.interface';

export interface IConRes {
    bookingId: number;
    bookingNo: string;
    status1?: number;
    status2?: number;
    status1Desc: string;
    status2Desc: string;
    state1?: number;
    state2?: number;
    eNo: string;
    fNo: string;
    price1: number;
    vatPrice1: number;
    price2: number;
    price3?: number;
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

export interface ICarRegisRes {
    bookingId: number;
    bookingNo: string;
    status1?: number;
    status2?: number;
    status1Desc: string;
    status2Desc: string;
    bookingDate: Date;
    state1?: number;
    state2?: number;
    eNo: string;
    fNo: string;
    price1?: number;
    vatPrice1?: number;
    netPrice1?: number;
    cutBalance?: number;
    price2?: number;
    price3?: number;
    totalPrice?: number;
    createBy?: number;
    createName: string;
    createDate?: Date;
    updateBy?: number;
    updateName: string;
    updateDate?: Date;
    branchId?: number;
    transportReceiptDate?: Date;
    transportServiceCharge?: number;
    branchName: string;
    branchProvince: string;
    tagNo: string;
    province: string;
    ownerCode: string;
    ownerName: string;
    visitorCode: string;
    visitorName: string;
    tagRegis?: Date;
    reason: string;
    remark: string;
    revNo: string;

    paymentPrice: number,
    discountPrice?: number,
    totalPaymentPrice: number,
    accBankId?: number,
    paymentDate: Date,
    documentRef: string
}

export interface ICarRegisItemRes {
    carRegisListItemRes: IConItemRes[];
    carRegisListItemDocRes: IConItemDocRes[];
}