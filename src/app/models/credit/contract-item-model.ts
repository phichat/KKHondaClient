export class ContractItemModel {
    public contractItemId: number;
    public contractId: number;
    public contractBranchId: number;
    public instalmentNo: number;
    public dueDate: Date;
    public vatRate: number;
    public balance: number;
    public balanceVatPrice: number;
    public balanceNetPrice: number;
    public payPrice: number;
    public payVatPrice: number;
    public payNetPrice: number;
    public discountRate: number;
    public discountPrice: number;
    public fineSum: number;
    public distcountSum: number;
    public taxInvoiceBranchId: number;
    public taxInvoiceNo: string;
    public netInvoice: number;
    public status: string;
    public interestInstalment: number; // ดอกเบี้ย
    public interestRemainAccount: number;
    public GoodsPriceRemain: number;
    public instalmentPrice: number;
    public remain: number;
    public remainVatPrice: number;
    public remainNetPrice: number;
    public delayDueDate: number;
    public createDate: Date;
    public createBy: string;
    public updateDate: Date;
    public updateBy: string;
}
