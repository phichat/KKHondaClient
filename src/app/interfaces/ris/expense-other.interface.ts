export interface IExpensesOtherRisRes {
  expensesID: number;
  expensesCode: string;
  expensesDescription: string;
  expensesAmount: number;
  expensesType: number;
  expensesTypeDesc: string;
  expensesTag: string;
  status: boolean;
  statusDesc: string;
  createBy: number;
  createName: string;
  dateCreate: Date;
  updateBy?: number;
  updateName: string;
  dateUpdate?: Date;
}
