export class ContractItemModel {
    public contractItemId: number;
    public contractId: number;
    public contractBranchId: number;
    public instalmentNo: number;
    public instalmentNoText: string;
    public refNo: string;
    public dueDate: any;
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
    public taxInvoiceBranchId: number;
    public taxInvoiceNo: string;
    public netInvoice: number;
    public status: number;
    public statusText: string;
    public interestInstalment: number;
    public interestRemainAccount: number;
    public goodsPrice: number;
    public goodsPriceRemain: number;
    public instalmentPrice: number;
    public remain: number;
    public remainVatPrice: number;
    public remainNetPrice: number;
    public remainInterest: number;
    public delayDueDate: number;
    public createBy: number;
    public createDate: Date;
    public updateBy: number;
    public updateDate: Date;

    public initialPrice: number;
    public principal: number;
    public principalRemain: number;
    public interestPrincipalRemain: number;
    public discountInterest: number;
}

