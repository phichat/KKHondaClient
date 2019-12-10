export enum ActionMode {
    Create = 1,
    Edit = 2,
    Detail = 3
}

export enum EntityType {
    Corperation = 'นิติบุคล',
    Layman = 'บุคคลธรรมดา'
}

export enum PaymentType {
    Cash = 1,
    Transfer = 2,
    Cheque = 3,
    CreditCard = 4
}

export const PaymentTypeList: any[] = [
    { id: PaymentType.Cash, desc: "เงินสด" },
    { id: PaymentType.Transfer, desc: "โอน" },
    { id: PaymentType.Cheque, desc: "เช็ค" },
    { id: PaymentType.CreditCard, desc: "บัตรเครดิต" },
];
