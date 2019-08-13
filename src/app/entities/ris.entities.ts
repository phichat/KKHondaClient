export enum PaymentType {
    Cash = 1,
    Transfer = 2
}

export enum ConStatus {
    Cancel = 0,
    Received = 1,
    Sending = 2,
    PartialDelivery = 3,
    CompleteDelivery = 4
}

export enum SedStatus {
    Normal = 1,
    Borrowed = 2,
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