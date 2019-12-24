export class ReceiveH {
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

export class ReceiveDetail {
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
  detail: ReceiveD[];
}

export class ReceiveD {
  id: string;
  receive_no: string;
  dealer_code: string;
  cat_id: string;
  cat_code: string;
  brand_id: string;
  brand_code: string;
  model_id: string;
  model_code: string;
  type_id: string;
  type_code: string;
  color_id: string;
  color_code: string;

  frame_no: string;
  engine_no: string;
  delivery_code: string;
  delivery_date: Date;
  invoice_no: string;
  tax_invoice_no: string;

  create_id: string;
  create_name: string;
  create_date: Date;
  update_id: string;
  update_name: string;
  update_date: Date;

  license_no: string;
  branch_id: string;
  branch_code: string;
  line_remark: string;
  line_status: string;
  line_status_name: string;
  cost_inc_vat: number;
  vat_flag: string;
  vat_rate: number;
  cost_vat: number;
  cost_exc_vat: number;
  cost_other_exc_vat: number;
  cost_repair_exc_vat: number;
  whl_id: number;
  item_id:number;
  log_id:number;
  whl_code:string;
}

export class searchlist {
  log_id: number;
  engine_no: string;
  frame_no: string;
  tax_no: string;
  inv_amt: number;
  vat_amt: number;
  model_code: string;
  model_type: string;
  color_code: string;
  cat_code: string;
  brand_code: string;
  item_id: number;
  cat_id: number;
  brand_id: number;
  model_id: number;
  type_id: number;
  color_id: number;
  dealer_code: string;
  delivery_code: string;
  delivery_date: Date;
  invoice_no: string;
}

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