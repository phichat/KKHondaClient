export interface ICarHistory {
  bookingId: number;
  branchId: number;
  carId: number;
  carNo: string;
  commitExpire?: Date;
  commitNo: string;
  eNo: string;
  fNo: string;
  owner: string;
  prbCompany: string;
  prbRegis?: Date;
  prbExpire?: Date;
  prbNo: string;
  province: string;
  tagNo: string;
  tagRegis?: Date;
  tagExpire?: Date;
  visitor: string;
  warCompany: string;
  warRegis?: Date;
  warExpire?: Date;
  warNo: string;
}

export interface ICarHistoryRes {
  carId: number;
  carNo: string;
  bookingId?: number;
  eNo: string;
  fNo: string;
  tagNo: string;
  province: string;
  branchId?: number;
  tagRegis?: Date;
  tagExpire?: Date;
  prbNo: string;
  prbCompany: string;
  prbRegis?: Date;
  prbExpire?: Date;
  commitNo: string;
  commitExpire?: Date;
  warNo: string;
  warCompany: string;
  warRegis?: Date;
  warExpire?: Date;
  ownerCode: string;
  ownerName: string;
  visitorCode: string;
  visitorName: string;
}