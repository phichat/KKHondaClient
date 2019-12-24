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
  dealer_no: string;
  cat_id: string;
  cat_name: string;
  brand_id: string;
  brand_name: string;
  model_id: string;
  model_name: string;
  type_id: string;
  type_name: string;
  color_id: string;
  color_name: string;
  
  frame_no: string;
  engine_no: string;
  delivery_no: string;
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
  branch_name: string;
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