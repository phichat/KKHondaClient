export interface ISpSearchSale {
  bookingId: number;
  contractId: number;
  saleId: number;
  branch: string;
  contractNo: string;
  sellNo: string;
  statusDesc: string;
  contractStatus: number;
  refNo: string;
  bookingPaymentType: number;
  contractHire: string;
  hireFullName: string;
  contractOwner: string;
  ownerFullName: string;
  hireIdCard: string;
  brand: string;
  color: string;
  model: string;
  engineNo: string;
  frameNo: string;
  endContractDate: Date;
  netPrice: number;
  saleDate: Date;
  saleFullName: string;
  saleRemark: string;
}
