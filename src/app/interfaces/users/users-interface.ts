import { IGroupPagePermissionRes } from '../groupPagePermission';

export interface IUserResCookie {
    id: number;
    adminName: string;
    fullName: string;
    userType?: number;
    branchId: number;
    branch: number;
    branchName: string;
    department: string;
    gId?: number;
    name: string;
    groupPagePermission: IGroupPagePermissionRes[]
}

export interface IUser {
    id: number;
    username: string;
    password: string;
    fullName: string;
    titleName: string;
    fName: string;
    lName: string;
    email: string;
    mobile: string;
    userType?: number;
    branchId: number;
    enable: number;
    department: string;
    createBy?: number;
    createDate?: Date;
    updateBy?: number;
    updateDate?: Date;
    gId?: number;
}
