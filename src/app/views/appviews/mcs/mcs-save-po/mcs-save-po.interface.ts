export interface savePO_H {
  po_id: number;
  po_no: string;
  status: number;
  status_desc: string;
  po_date: Date;
  due_date: Date;
  supplier_id: number;
  supplier_name: string;
  remark: string;
  create_id:number;
  create_name: string;
  create_date: Date;
  update_id:number;
  update_name: string;
  update_date: Date;

  cash_flag: string;
  cash_price:number;

  cheque_flag: string;
  cheque_bank_id:number;
  cheque_branch: string;
  cheque_no: string;
  cheque_date: Date;
  cheque_price:number;

  total_price:number;
  vat_flag: string;
  total_vat_price:number;
  total_net_price:number;
}

export interface savePO_Detail {
  po_id: number;
  po_no: string;
  status: number;
  status_desc: string;
  po_date: Date;
  due_date: Date;
  supplier_id: number;
  supplier_name: string;
  remark: string;
  create_id:number;
  create_name: string;
  create_date: Date;
  update_id:number;
  update_name: string;
  update_date: Date;

  cash_flag: string;
  cash_price:number;

  cheque_flag: string;
  cheque_bank_id:number;
  cheque_branch: string;
  cheque_no: string;
  cheque_date: Date;
  cheque_price:number;

  total_price:number;
  
  vat_flag: string;
  total_vat:number;
  total_vat_price:number;
  total_net_price:number;
  detail: savePO_D[];
}

export interface savePO_D {
  po_id: number;
  po_no: string;
  
  cat_id: number;
  cat_name: string;
  brand_id: number;
  brand_name: string;
  model_id: number;
  model_name: string;
  type_id: number;
  type_name: string;
  color_id: number;
  color_name: string;
  unit_price: number;
  unit_qty: number;  
  create_id:number;
  create_name: string;
  create_date: Date;
  update_id:number;
  update_name: string;
  update_date: Date;

}

export enum LoadingEntities {
  loading = 0,
  noRecord = 1,
  error = 2
} 