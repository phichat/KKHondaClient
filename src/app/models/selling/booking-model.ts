import { BookingItemModel } from './booking-item-model';

export class BookingModel {
    public address: string;
    public contractNo: string;
    public deposit: number;
    public distcountB: number;
    public distcountP: number;
    public distcountPPrice: number;
    public email: string;
    public custCode: string;
    public custFullName: string;
    public genderCode: number;
    public genderName: string;
    public idCard: string;
    public bookingDate: Date;
    public depositType: number;
    public bookingId: number;
    public bookingNo: string;
    public ptymentType: number;
    public bookingStatus: number;
    public bookingType: number;
    public netPrice: number;
    public nickName: string;
    public outStandingPrice: number;
    public receiveDate: Date;
    public remark: string;
    public sellPrice: number;
    public totalDiscount: number;
    public vat: number;
    public vatPrice: number;
    public freeAct: number;
    public freeTag: number;
    public freeWarranty: number;
    public bookingItem: Array<BookingItemModel>;
}

