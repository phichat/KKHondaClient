import { Component, OnInit } from '@angular/core';
import { setLocalDate } from 'app/app.config';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoaderService } from 'app/core/loader/loader.service';
import { McsStockReceiveService } from './mcs-stock-receive.service';
import { LoadingEntities, AutoCompleteModel, ReceiveDetail } from './mcs-stock-receive.interface';
import { tap, finalize } from 'rxjs/operators';
import { UserService } from 'app/services/users';
import { IUserResCookie } from 'app/interfaces/users';
import { message } from 'app/app.message';
import { Router } from '@angular/router';
import * as $ from 'jquery';


declare var toastr: any;

@Component({
  selector: 'app-mcs-stock-receive-single-detail',
  templateUrl: './mcs-stock-receive-single-detail.component.html',
  styleUrls: ['./mcs-stock-receive-single-detail.component.scss']
})
export class McsStockReceiveSingleDetailComponent implements OnInit {


  public headers: Array<string> = new Array("ลำดับ", "ประเภทสินค้า", "ยี่ห้อ", "รุ่น", "แบบ", "สี", "หมายเลขเครื่อง", "หมายเลขตัวถัง", "เลขที่ใบแจ้งหนี้", "ราคา(ไม่รวม VAT)", "ค่าอื่นๆ", "ค่าซ่อม");

  public code: string;

  // myDatePickerOptions = MyDatePickerOptions;
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

    this.s_service.get_wh_all().subscribe(x => {
      this.AC_Warehouse = x;
    });

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


    this.formGroup = this.fb.group({
      id: new FormControl({ value: null, disabled: true }),
      receive_no: new FormControl({ value: null, disabled: true }),
      receive_id: new FormControl({ value: null, disabled: true }, Validators.required),
      receive_date: new FormControl({ value: null, disabled: true }, Validators.required),
      receive_status: new FormControl({ value: null, disabled: true }),
      receive_type: new FormControl({ value: null, disabled: true }),
      dealer_code: new FormControl({ value: null, disabled: true }, Validators.required),
      transfer_code: new FormControl({ value: null, disabled: true }, Validators.required),
      purchase_no: new FormControl({ value: null, disabled: true }),
      remark: new FormControl({ value: null, disabled: true }),
      create_id: new FormControl({ value: null, disabled: true }),
      create_date: new FormControl({ value: null, disabled: true }),
      update_id: new FormControl({ value: null, disabled: true }),
      update_date: new FormControl({ value: null, disabled: true }),
      delivery_code: new FormControl({ value: null, disabled: true }),
      delivery_date: new FormControl({ value: null, disabled: true }, Validators.required),
      detail: this.fb.array([])
    });

    this.activeRoute.params.subscribe(o => {
      this.code = o['code'];

      this.s_service.receive_detail(`${this.code}`)
        .pipe(tap(() => this.s_loader.show()))
        .subscribe((x: ReceiveDetail) => {

          this.formGroup.patchValue({ ...x });

          if (!x.detail.length) {
            this.loading = this.LoadingEnt.noRecord;
          } else {

            x.detail.forEach(item => {

              var cost_total = item.cost_exc_vat + item.cost_vat + item.cost_other_exc_vat + item.cost_repair_exc_vat;

              const fg = this.fb.group({
                cat_id: new FormControl({ value: item.cat_id, disabled: true }),
                brand_id: new FormControl({ value: item.brand_id, disabled: true }),
                model_id: new FormControl({ value: item.model_id, disabled: true }),
                type_id: new FormControl({ value: item.type_id, disabled: true }),
                color_id: new FormControl({ value: item.color_id, disabled: true }),
                engine_no: new FormControl({ value: item.engine_no, disabled: true }),
                frame_no: new FormControl({ value: item.frame_no, disabled: true }),
                invoice_no: new FormControl({ value: item.invoice_no, disabled: true }),
                cost_exc_vat: new FormControl({ value: item.cost_exc_vat, disabled: true }),
                cost_other_exc_vat: new FormControl({ value: item.cost_other_exc_vat, disabled: true }),
                cost_repair_exc_vat: new FormControl({ value: item.cost_repair_exc_vat, disabled: true }),

                cat_code: new FormControl({ value: item.cat_code, disabled: true }),
                brand_code: new FormControl({ value: item.brand_code, disabled: true }),
                model_code: new FormControl({ value: item.model_code, disabled: true }),
                type_code: new FormControl({ value: item.type_code, disabled: true }),
                color_code: new FormControl({ value: item.color_code, disabled: true }),

                id: new FormControl({ value: item.id, disabled: true }),
                receive_no: new FormControl({ value: item.receive_no, disabled: true }),
                dealer_code: new FormControl({ value: item.dealer_code, disabled: true }),
                delivery_code: new FormControl({ value: item.delivery_code, disabled: true }),
                delivery_date: new FormControl({ value: item.delivery_date, disabled: true }),
                tax_invoice_no: new FormControl({ value: item.tax_invoice_no, disabled: true }),
                license_no: new FormControl({ value: item.license_no, disabled: true }),
                branch_id: new FormControl({ value: item.branch_id, disabled: true }),
                branch_code: new FormControl({ value: item.branch_code, disabled: true }),
                line_remark: new FormControl({ value: item.line_remark, disabled: true }),
                line_status: new FormControl({ value: 1, disabled: true }),
                cost_inc_vat: new FormControl({ value: item.cost_inc_vat, disabled: true }),
                vat_flag: new FormControl({ value: item.vat_flag, disabled: true }),
                vat_rate: new FormControl({ value: item.vat_rate, disabled: true }),
                cost_vat: new FormControl({ value: item.cost_vat, disabled: true }),
                whl_id: new FormControl({ value: item.whl_id, disabled: true }),
                cost_total: new FormControl({ value: cost_total, disabled: true }),

                province_code: new FormControl({ value: item.province_code, disabled: true }),
                chk_vat: new FormControl({ value: (item.vat_flag == 'Y' ? true : false), disabled: true }),

              });
              this.DetailList.push(fg);
            });

            this.reInitDatatable();
          }
          this.s_loader.onEnd();
        }, () => toastr.error(message.error));
    });

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

}



