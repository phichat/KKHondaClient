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
    public bookingDate: any;
    public bookingDepositType: number;
    public bookDeposit: number;
    public bookingId: number;
    public bookingNo: string;
    public bookingPaymentType: number;
    public bookingStatus: number;
    public bookingType: number;
    public netPrice: number;
    public nickName: string;
    public outStandingPrice: number;
    public receiveDate: any;
    public remark: string;
    public sellPrice: number;
    public totalDiscount: number;
    public vat: number;
    public vatPrice: number;
    public freeAct: boolean;
    public freeTag: boolean;
    public freeWarranty: boolean;
    public bookingItem: Array<BookingItemModel>;

    public cusSellCode: string;
    public cusSellName: string;
    public cusTaxNo: string;
    public cusTaxBranch: string;
    public sellRemark: string;
}

