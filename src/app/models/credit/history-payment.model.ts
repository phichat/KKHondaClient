export class HistoryPaymentModel {
    public contractNo: number;
    public contractDate: Date;
    public instalmentEnd: number;
    public payBefore: number;
    public payMatch: number;
    public payLate: number;
    public rateLate: number;
    public grade: string;
}