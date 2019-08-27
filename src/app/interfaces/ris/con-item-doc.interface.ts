export interface IConItemDoc {
    bookingNo: string;
    sendBackCode: string;
    isReceive: string;
    receiveDate: string;
    receiveBy: string;
    isSend?: boolean;
    sendBy?: number;
    sendDate?: Date;
}

export interface IConItemDocRes {
    bookingNo: string;
    sendBackCode: string;
    sendBackName: string;
    isReceive: string;
    receiveDate: string;
    receiveBy: string;
    receiveName: string;
    isSend?: boolean;
    sendBy?: number;
    sendName: string;
    sendDate?: Date;
}