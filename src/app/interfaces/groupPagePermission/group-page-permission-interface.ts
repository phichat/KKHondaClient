export interface IGroupPagePermission {
    gPPId: number;
    gId?: number;
    pageId?: number;
    status?: number;
}

export interface IGroupPagePermissionRes {
    gPPId: number;
    gId?: number;
    gName: string;
    pageId?: number;
    pageName: string;
}