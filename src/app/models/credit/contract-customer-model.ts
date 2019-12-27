export class ContractCustomerModel {
    public clId: number;
    public contractId: number;
    public communicateType: string;
    public addressType: string;
    public branchId: number;
}

export class ContractCustomerDetailModel {
    public cldId: number;
    public contractId: number;
    public cldDate: Date;
    public cldBookNo: string;
    public cldReferNo: string;
    public cldSubject: string;
    public cldExpenses: string;
    public cldStatus: string;
    public cldComeback: string;
    public cldPaymentDate: Date;
    public cldOperatorId: number;
    public cldTurnover: string;
    public cldCompletDate: Date;
}

export class ContractCustomerGroupModel {
    public head: ContractCustomerModel;
    public detail: ContractCustomerDetailModel;
}

export class ContractCustomerGroupListModel {
    public head: ContractCustomerModel;
    public detail: ContractCustomerDetailModel[];
}

export class ContractCustomerListModel {
    public contractId: number;
    public contractNo: string;
    public contractDate: string;
    public contractHire: string;
    public contractGurantor1: string;
    public contractGurantor2: string;
    public statusDesc: string;
    public communicateType: string;
    public addressType: string;
}
