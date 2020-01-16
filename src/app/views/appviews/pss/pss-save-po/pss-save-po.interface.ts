
export enum LoadingEntities {
  loading = 0,
  noRecord = 1,
  error = 2
}

export class AutoCompleteModel {
  value: string;
  text: string;
}

export class PurchaseList {
  po_no: string;
  branch_id: number;
  branch_name: string;
  dealer_code: string;
  dealer_name: string;
  po_type: number;
  po_type_name: string;
  po_status: number;
  po_status_name: string;
  po_date: Date;
  delivery_date: Date;
  contact_name: string;
  contact_phone: string;
  contact_fax: string;
  po_remark: string;
  create_id: number;
  create_name: string;
  create_date: Date;
  update_id: number;
  update_name: string;
  update_date: Date;
}

export class PurchaseHead {
  po_no: string;
  branch_id: number;
  dealer_code: string;
  po_type: number;
  po_status: number;
  po_date: Date;
  delivery_date: Date;
  contact_name: string;
  contact_phone: string;
  contact_fax: string;
  po_remark: string;
  create_id: number;
  create_date: Date;
  update_id: number;
  update_date: Date;
  detail: PurchaseDetail[];
}

export class PurchaseDetail {
  po_no: string;
  log_id: number;
  item_id: number;
  item_code: string;
  item_name: string;
  cost_inc_vat: number;
  vat_flag: string;
  vat_rate: number;
  cost_vat: number;
  cost_exc_vat: number;
  cost_discount: number;
  cost_other_exc_vat: number;
  cost_repair_exc_vat: number;
  po_qty: number;
  receive_qty: number;
  total:number;
}

export class ItemDetail {
  item_id: number;
  item_code: string;
  item_name: string;
  item_cost: number;
  text: string;
  value: number;
} 