
export interface ILeasingInterest {
  fiintId: number;
  fiId: number;
  fiintNo: number;
  leasingComList: ILeasingCommission[];
}

export interface ILeasingCommission {
  ficomId: number;
  fiId: number;
  fiintId: number;
  minCtId: number;
  maxCtId: number;
  minCtNo: number;
  maxCtNo: number;
  minDown: number;
  maxDown: number;
  comPrice: number;
}

export interface ILeasing {
  fiId: number;
  leasingCode: string;
  leasingName: string;
  leasingIntList: ILeasingInterest[];
}
