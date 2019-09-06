export interface IMSendback {
    id: number;
    code: string;
    name: string;
    status: boolean;
    checked: boolean;
    newCar: boolean;
    tag: boolean;
    act: boolean;
    warranty: boolean;
    checkCar: boolean;
    other: boolean;
    updateBy?: number;
    updateDate?: Date;
    createBy: number;
    createDate: Date;
}
