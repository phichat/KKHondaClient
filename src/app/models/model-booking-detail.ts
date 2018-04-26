export class ModelBookingDetail {
    constructor(
        public custCode: string,
        public custTitleName: string,
        public custFullName: string,
        public custTel: string,
        public bookingCode: string,
        public bookingStatus: string,
        public bookingDate: Date,
        public bookingPrice: number,
        public deliverDate: Date,
        public empCode: string,
        public empTitleName: string,
        public empFullName: string,
        public branchCode: string,
        public branchName: string,
        public remark: string,
        public mbAmnt: string,
        public itemAmnt: string,
        public totalSell: number,
        public totalDiscount: number,
        public totalVat: number,
        public totalSellNet: number
    ) {

    }
}
