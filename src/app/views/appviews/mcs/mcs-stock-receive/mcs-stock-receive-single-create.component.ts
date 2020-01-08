import { Component, OnInit } from '@angular/core';
import { setLocalDate, getDateMyDatepicker } from 'app/app.config';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoaderService } from 'app/core/loader/loader.service';
import { MyDatePickerOptions } from 'app/app.config';
import { McsStockReceiveService } from './mcs-stock-receive.service';
import { ReceiveD, LoadingEntities, AutoCompleteModel } from './mcs-stock-receive.interface';
import { tap, finalize } from 'rxjs/operators';
import { UserService } from 'app/services/users';
import { IUserResCookie } from 'app/interfaces/users';
import { message } from 'app/app.message';
import { Router } from '@angular/router';
import * as $ from 'jquery';


declare var toastr: any;

@Component({
  selector: 'app-mcs-stock-receive-single-create',
  templateUrl: './mcs-stock-receive-single-create.component.html',
  styleUrls: ['./mcs-stock-receive-single-create.component.scss']
})
export class McsStockReceiveSingleCreateComponent implements OnInit {


  public headers: Array<string> = new Array("ลำดับ", "ประเภทสินค้า", "ยี่ห้อ", "รุ่น", "แบบ", "สี", "หมายเลขเครื่อง", "หมายเลขตัวถัง", "เลขที่ใบแจ้งหนี้", "ราคา(ไม่รวม VAT)", "ค่าอื่นๆ", "ค่าซ่อม");

  public code: string;

  myDatePickerOptions = MyDatePickerOptions;
  displayLocalDate = setLocalDate;
  formGroup: FormGroup;
  mUser: IUserResCookie;
  Data = new BehaviorSubject(null);
  LoadingEnt = LoadingEntities;
  loading: number;
  dataTable: any;

  AC_Warehouse: AutoCompleteModel[];
  AC_Dealer: AutoCompleteModel[];
  AC_User: AutoCompleteModel[];
  AC_Type: AutoCompleteModel[];
  AC_Status: AutoCompleteModel[];
  AC_Branch: AutoCompleteModel[];
  AC_Province: AutoCompleteModel[];

  AC_PrdCategory: AutoCompleteModel[];
  AC_PrdBrand: AutoCompleteModel[];
  AC_PrdModel: AutoCompleteModel[];
  AC_PrdType: AutoCompleteModel[];
  AC_PrdColor: AutoCompleteModel[];

  list: ReceiveD[] = [];
  subscription: Subscription;
  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private s_loader: LoaderService,
    private s_service: McsStockReceiveService,
    private s_user: UserService,
    private route: Router
  ) {
  }

  ngOnInit() {

    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }

    this.s_service.get_dealer().subscribe(x => {
      this.AC_Dealer = x;
    });
    this.s_service.GetUserAutoComplete().subscribe(x => {
      this.AC_User = x;
    });
    this.s_service.get_autocomplete('REC_TYPE').subscribe(x => {
      this.AC_Type = x;
    });
    this.s_service.get_autocomplete('REC_STATUS').subscribe(x => {
      this.AC_Status = x;
    });

    this.s_service.GetBranchAutoComplete().subscribe(x => {
      this.AC_Branch = x;
    });
    this.s_service.get_province().subscribe(x => {
      this.AC_Province = x;
    });


    this.s_service.get_cat().subscribe(x => {
      this.AC_PrdCategory = x;
    });
    this.s_service.GetBrandAutoComplete().subscribe(x => {
      this.AC_PrdBrand = x;
    });
    this.s_service.GetModelAutoComplete().subscribe(x => {
      this.AC_PrdModel = x;
    });
    this.s_service.GetTypeAutoComplete().subscribe(x => {
      this.AC_PrdType = x;
    });
    this.s_service.GetColorAutoComplete().subscribe(x => {
      this.AC_PrdColor = x;
    });

    this.loading = 1;
    this.mUser = this.s_user.cookies;

    let date = new Date();
    var today = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    }
    this.formGroup = this.fb.group({
      id: new FormControl({ value: null, disabled: false }),
      receive_no: new FormControl({ value: null, disabled: true }),
      receive_id: new FormControl({ value: this.mUser.branchId, disabled: false }, Validators.required),
      receive_date: new FormControl({ value: today, disabled: false }, Validators.required),
      receive_status: new FormControl({ value: 2, disabled: false }),
      receive_type: new FormControl({ value: 2, disabled: true }),

      dealer_code: new FormControl({ value: 'AP-11', disabled: false }, Validators.required),
      transfer_code: new FormControl({ value: 'AP-11', disabled: false }, Validators.required),
      purchase_no: new FormControl({ value: null, disabled: false }),
      remark: new FormControl({ value: null, disabled: false }),
      create_id: new FormControl({ value: this.s_user.cookies.id, disabled: false }),
      create_date: new FormControl({ value: null, disabled: false }),

      update_id: new FormControl({ value: null, disabled: false }),
      update_date: new FormControl({ value: null, disabled: false }),

      delivery_code: new FormControl({ value: null, disabled: false }),
      delivery_date: new FormControl({ value: today, disabled: false }, Validators.required),

      detail: this.fb.array([])
    });

    const fg = this.fb.group({
      cat_id: new FormControl({ value: null, disabled: false }, Validators.required),
      brand_id: new FormControl({ value: null, disabled: false }, Validators.required),
      model_id: new FormControl({ value: null, disabled: false }, Validators.required),
      type_id: new FormControl({ value: null, disabled: false }, Validators.required),
      color_id: new FormControl({ value: null, disabled: false }, Validators.required),
      engine_no: new FormControl({ value: null, disabled: false }, Validators.required),
      frame_no: new FormControl({ value: null, disabled: false }, Validators.required),
      invoice_no: new FormControl({ value: null, disabled: false }),
      cost_exc_vat: new FormControl({ value: 0, disabled: false }),
      cost_other_exc_vat: new FormControl({ value: 0, disabled: false }),
      cost_repair_exc_vat: new FormControl({ value: 0, disabled: false }),

      province_code: new FormControl({ value: null, disabled: false }),

      id: new FormControl({ value: null, disabled: false }),
      receive_no: new FormControl({ value: null, disabled: false }),
      dealer_code: new FormControl({ value: null, disabled: false }),
      delivery_code: new FormControl({ value: null, disabled: false }),
      delivery_date: new FormControl({ value: null, disabled: false }),
      tax_invoice_no: new FormControl({ value: null, disabled: false }),
      license_no: new FormControl({ value: null, disabled: false }),
      branch_id: new FormControl({ value: null, disabled: false }, Validators.required),
      line_remark: new FormControl({ value: null, disabled: false }),
      line_status: new FormControl({ value: 1, disabled: false }),
      cost_inc_vat: new FormControl({ value: 0, disabled: false }),
      vat_flag: new FormControl({ value: false, disabled: false }),
      vat_rate: new FormControl({ value: 0, disabled: false }),
      cost_vat: new FormControl({ value: 0, disabled: false }),

      whl_id: new FormControl({ value: null, disabled: false }, Validators.required),

      cost_total: new FormControl({ value: 0, disabled: false }),
      item_id: new FormControl({ value: 0, disabled: false }),

      chk_vat: new FormControl({ value: 0, disabled: false }),
    });
    this.DetailList.push(fg);

  }

  initDatatable(): void {
    let table: any = $('table.set-dataTable');
    this.dataTable = table.DataTable({
      scrollY: '50vh',
      scrollCollapse: true,
      paging: false,
      searching: false,
      ordering: false,
      info: false
    });
  }

  reInitDatatable(): void {
    this.destroyDatatable()
    setTimeout(() => this.initDatatable(), 0)
  }

  destroyDatatable() {
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }
  }


  get DetailList(): FormArray {
    return this.formGroup.get('detail') as FormArray;
  }


  onSubmit() {
    this.s_loader.showLoader()


    let f = this.formGroup.getRawValue();
    f = {
      ...f,
      receive_date: getDateMyDatepicker(f.receive_date),
      delivery_date: getDateMyDatepicker(f.delivery_date)
    }
    this.s_service.ReceiveSingleCreate(f)
      .pipe(finalize(() => this.s_loader.onEnd()))
      .subscribe(() => {
        toastr.success(message.created);
        this.route.navigate(['mcs/mcs-stock-receive-list']);
      }, (err) => {
        toastr.error(err.error);
      });
  }

  list_wh = [];
  load_wh_line(index: number) {
    this.DetailList.controls[index].patchValue({
      whl_id: null,
    });
    this.reload_wh();
  }

  reload_wh() {
    this.list_wh = [];
    this.DetailList.value.forEach(d => {
      this.s_service.get_wh(Number(d.branch_id)).subscribe(x => {
        var AC: AutoCompleteModel[] = x;
        this.list_wh.push(AC);
      });
    });
  }

  calculateTotal(i) {
    const fg = this.DetailList.at(i);
    const item = fg.value;

    var cost_exc_vat = item.cost_exc_vat;
    var vat_flag = item.chk_vat ? 'Y' : null;
    var vat_rate = (item.chk_vat ? 7 : 0);
    var cost_vat = (item.chk_vat ? (item.cost_exc_vat / 100) * 7 : 0);
    var cost_inc_vat = item.cost_exc_vat + cost_vat;
    var cost_other_exc_vat = item.cost_other_exc_vat;
    var cost_repair_exc_vat = item.cost_repair_exc_vat;
    var cost_total = cost_exc_vat + cost_vat + cost_other_exc_vat + cost_repair_exc_vat;
    fg.patchValue({
      vat_flag: vat_flag,
      vat_rate: vat_rate,
      cost_vat: Number(cost_vat.toFixed(2)),
      cost_exc_vat: cost_exc_vat,
      cost_inc_vat: Number(cost_inc_vat.toFixed(2)),
      cost_other_exc_vat: cost_other_exc_vat,
      cost_repair_exc_vat: cost_repair_exc_vat,
      cost_total: Number(cost_total.toFixed(2)),
    });
    fg.updateValueAndValidity();

  }


  debug() {
    let f = this.formGroup.getRawValue();
    f = {
      ...f,
      receive_date: getDateMyDatepicker(f.receive_date),
      delivery_date: getDateMyDatepicker(f.delivery_date)
    }
    console.log(f);
  }

}



