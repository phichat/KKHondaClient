export interface IConItemDoc {
    bookingNo: string;
    sendBackCode: string;
    isReceive: string;
    receiveDate: any;
    receiveBy: string;
    isSend?: boolean;
    sendBy?: number;
    sendDate?: any;
}

export interface IConItemDocRes {
    bookingNo: string;
    sendBackCode: string;
    sendBackName: string;
    isReceive: string;
    receiveDate: any;
    receiveBy: string;
    receiveName: string;
    isSend?: boolean;
    sendBy?: number;
    sendName: string;
    sendDate?: any;
}