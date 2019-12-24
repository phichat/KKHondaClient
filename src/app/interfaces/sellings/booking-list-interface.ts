import { BookingListModel } from '../../models/selling';

export interface BookingListInterface {
    BookingList: Array<BookingListModel>
}

export interface IBookingCarDetail {
    bookingId: number;
    bookingPaymentType: number;
    ownerCode: string;
    ownerName: string;
    typeId?: number;
    typeName: string;
    brandId?: number;
    brandName: string;
    modelId?: number;
    modelName: string;
    colorId?: number;
    colorName: string;
    engineNo: string;
    frameNo: string;
    logReceiveId?: number;
    freeAct?: number;
    freeWarranty?: number;
    freeTag?: number;
}
