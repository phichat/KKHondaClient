
export enum LoadingEntities {
  loading = 0,
  noRecord = 1,
  error = 2
}

export class AutoCompleteModel {
  value: string;
  text: string;
}

export class line_select {
  log_id: number;
  ac: AutoCompleteModel[];
}

export class ReceiveList {
  id: number;
  receive_no: string;
  receive_id: number;
  receive_name: string;
  receive_date: Date;
  receive_status: number;
  receive_status_name: string;
  receive_type: number;
  receive_type_name: string;
  dealer_code: string;
  dealer_name: string;
  purchase_no: string;
  remark: string;
  create_id: number;
  create_name: string;
  create_date: Date;
  update_id: number;
  update_name: string;
  update_date: Date;
}

export class ReturnList {
  return_no: string;
  return_date:Date;
  return_type: number;
  return_type_name: string;
  return_status: number;
  return_status_name: string;
  dealer_code: string;
  dealer_name: string;
  receive_no: string;
  receive_date: Date;
  remark: string;

  create_id: number;
  create_name: string;
  create_date: Date;
  update_id: number;
  update_name: string;
  update_date: Date;
}

export class ReturnHead {
  return_no: string;
  return_date:Date;
  return_type: number;
  return_status: number;
  dealer_code: string;
  receive_no: string;
  receive_date: Date;
  remark: string;
  create_id: number;
  create_date: Date;
  update_id: number;
  update_date: Date;
  detail:ReturnDetail[];
}

export class ReturnDetail {
  return_no: string;
  receive_no: string;
  tax_invoice_no: string;
  item_id: number;
  item_name:string;
  log_id: number;
  return_qty: number;
  return_amt: number;
}

export class SearchList {
  item_id: number;
  log_id: number;
  receive_no: string;
  tax_invoice_no: string;
  return_qty: number;
  return_amt: number;
  product_code: string;
  product_name: string;
  stock_amt:number;
  stock_qty:number;
}

export class ReturnAvailable {

  item_id: number;
  log_id: number;
  receive_no: string;
  tax_invoice_no: string;
  return_qty: number;
  return_amt: number;
  product_code: string;
  product_name: string;
  stock_amt:number;
  stock_qty:number;
}
