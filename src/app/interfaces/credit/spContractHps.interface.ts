export interface ISpContractHps {
    contractId: number;
    saleId: number;
    branch: string;
    bookingPaymentType?: number;
    contractNo: string;
    contractType: string;
    contractDate?: Date;
    areaPayment: string;
    contractPoint: string;
    contractGroup: string;
    statusDesc: string;
    contractStatus?: number;
    refNo: string;
    hireFullName: string;
    hireIdCard: string;
    brand: string;
    color: string;
    model: string;
    engineNo: string;
    frameNo: string;
    endContractDate?: Date;
}