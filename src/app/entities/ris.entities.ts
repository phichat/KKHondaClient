export enum PaymentType {
    Cash = 1,
    Transfer = 2,
    Cheque = 3
}

export enum PaymentStatus {
    Cancel = 0,         // ยกเลิก
    IsPayment = 1       // ชำระแล้ว
}

export enum ConStatus1 {
    Cancel = 0,
    Received = 1,
    Withdraw1 = 2,
    Withdraw2 = 3,
    // Sending = 4,
    // PartialDelivery = 5,
    // CompleteDelivery = 6
}

export const ConStatus1List: any[] = [
    { id: ConStatus1.Cancel, desc: "ยกเลิก" },
    { id: ConStatus1.Received, desc: "รับเอกสารเข้าระบบ" },
    { id: ConStatus1.Withdraw1, desc: "เบิกเงินครั้งที่ 1" },
    { id: ConStatus1.Withdraw2, desc: "เบิกเงินครั้งที่ 2" }
];

export enum ConStatus2 {
    Send1 = 1,
    Send2 = 2,
    REV = 3
}

export const ConStatus2List: any[] = [
    { id: ConStatus2.Send1, desc: "ส่งเรื่องครั้งที่ 1" },
    { id: ConStatus2.Send2, desc: "ส่งเรื่องครั้งที่ 2" },
    { id: ConStatus2.REV, desc: "บันทึกรับคืนเรื่อง" }
];

export enum RevStatus {
    Normal = 1,
    Cancel = 0
}

export const RevStatusList: any[] = [
    { id: RevStatus.Normal, desc: "ปกติ" },
    { id: RevStatus.Cancel, desc: "ยกเลิก" }
];

export enum SedStatus {
    Normal = 1,
    Borrowed = 2,
    Received = 3,
    Cancel = 0
}

export enum AlStatus {
    Cancel = 0,
    Normal = 1,
    CashBack = 2
}

export enum ClStatus {
    Cancel = 0,
    Normal = 1
}

export enum RisLocalStoreage {
    TrashCarRegisListItem = "Trash_CarRegisListItem"
}

export enum UserForRis {
    Sale = 1019,
    Regist = 1029
}

export enum ExpensesType {
    Service = 1,
    Expenses = 2,
    InternalCost = 3
}

export enum ReceiveClStatus {
    Cancel = 0,
    Normal = 1
}

export enum ExpensesTag {
    EXP10001 = 'EXP10001',
    EXP10002 = 'EXP10002',
    EXP10003 = 'EXP10003',
    EXP10004 = 'EXP10004'
}