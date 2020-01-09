import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { setLocalDate } from 'app/app.config';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoaderService } from 'app/core/loader/loader.service';
import { PssStockReceiveService } from './pss-stock-receive.service';
import { ReceiveD, LoadingEntities, AutoCompleteModel, searchlist, ReceiveDetail } from './pss-stock-receive.interface';
import { tap, finalize } from 'rxjs/operators';
import { UserService } from 'app/services/users';
import { IUserResCookie } from 'app/interfaces/users';
import { message } from 'app/app.message';
import { Router } from '@angular/router';
import * as $ from 'jquery';

declare var toastr: any;

@Component({
  selector: 'app-pss-stock-receive-detail',
  templateUrl: './pss-stock-receive-detail.component.html',
  styleUrls: ['./pss-stock-receive-detail.component.scss']
})
export class PssStockReceiveDetailComponent implements OnInit {


  public code: string;
  public checkedAll: boolean;
  // myDatePickerOptions = MyDatePickerOptions;
  displayLocalDate = setLocalDate;
  formGroup: FormGroup;
  searchformGroup: FormGroup;
  mUser: IUserResCookie;
  Data = new BehaviorSubject(null);
  LoadingEnt = LoadingEntities;
  loading: number;

  searchLoadingEnt = LoadingEntities;
  searchloading: number;

  detaildataTable: any;
  searchdataTable: any;
  AC_Warehouse: AutoCompleteModel[];

  AC_Dealer: AutoCompleteModel[];
  AC_User: AutoCompleteModel[];
  AC_Type: AutoCompleteModel[];
  AC_Status: AutoCompleteModel[];

  AC_Branch: AutoCompleteModel[];

  AC_PrdCategory: AutoCompleteModel[];
  AC_PrdBrand: AutoCompleteModel[];
  AC_PrdModel: AutoCompleteModel[];
  AC_PrdType: AutoCompleteModel[];
  AC_PrdColor: AutoCompleteModel[];

  list: ReceiveD[] = [];
  search_list: searchlist[] = [];

  subscription: Subscription;
  constructor(
    private fb: FormBuilder,
    private searchfb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private s_loader: LoaderService,
    private s_service: PssStockReceiveService,
    private s_user: UserService,
    private route: Router
  ) {
  }

  ngOnInit() {

    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }


    this.s_service.GetBranchAutoComplete().subscribe(x => {
      this.AC_Branch = x;
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

    this.loading = this.LoadingEnt.noRecord;
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
      id: new FormControl({ value: null, disabled: true }),
      receive_no: new FormControl({ value: null, disabled: true }),
      receive_id: new FormControl({ value: null, disabled: true }),
      receive_date: new FormControl({ value: today, disabled: true }, Validators.required),
      receive_status: new FormControl({ value: 2, disabled: true }),
      receive_type: new FormControl({ value: 3, disabled: true }),

      dealer_code: new FormControl({ value: null, disabled: true }, Validators.required),
      purchase_no: new FormControl({ value: null, disabled: true }),
      remark: new FormControl({ value: null, disabled: true }),
      create_id: new FormControl({ value: null, disabled: true }),
      create_date: new FormControl({ value: null, disabled: true }),

      update_id: new FormControl({ value: null, disabled: true }),
      update_date: new FormControl({ value: null, disabled: true }),

      delivery_code: new FormControl({ value: null, disabled: true }),
      delivery_date: new FormControl({ value: today, disabled: true }, Validators.required),

      cost_inc_vat: new FormControl({ value: 0, disabled: true }),
      vat_flag: new FormControl({ value: '', disabled: true }),
      vat_rate: new FormControl({ value: 0, disabled: true, }),
      cost_vat: new FormControl({ value: 0, disabled: true }),
      cost_exc_vat: new FormControl({ value: 0, disabled: true }),
      cost_other_repair: new FormControl({ value: 0, disabled: true }),
      cost_total: new FormControl({ value: 0, disabled: true }),

      detail: this.fb.array([]),

    });

    this.DetailList.valueChanges.subscribe(x => {
      var cost_exc_vat = 0;
      var total_vat = 0;
      var cost_other_exc_vat = 0;
      var cost_repair_exc_vat = 0;

      cost_exc_vat += x.reduce((a, c) => a += (!(Number(c.cost_exc_vat) * Number(c.receive_qty)) ? 0 : (Number(c.cost_exc_vat) * Number(c.receive_qty))), 0);
      cost_other_exc_vat += x.reduce((a, c) => a += (!(Number(c.cost_other_exc_vat) * Number(c.receive_qty)) ? 0 : (Number(c.cost_other_exc_vat) * Number(c.receive_qty))), 0);
      cost_repair_exc_vat += x.reduce((a, c) => a += (!(Number(c.cost_repair_exc_vat) * Number(c.receive_qty)) ? 0 : (Number(c.cost_repair_exc_vat) * Number(c.receive_qty))), 0);
      total_vat = x.reduce((a, c) => a += (!(Number(c.cost_exc_vat) * Number(c.receive_qty)) || !Number(c.vat_rate) ? 0 : ((Number(c.cost_exc_vat) / 100) * Number(c.vat_rate)) * Number(c.receive_qty)), 0);
      this.formGroup.patchValue({
        cost_other_repair: cost_other_exc_vat + cost_repair_exc_vat,
        cost_vat: total_vat,
        cost_total: cost_exc_vat + total_vat + (cost_other_exc_vat + cost_repair_exc_vat),
        cost_exc_vat: cost_exc_vat,
      });
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

            var vat_flag = '';
            var vat_rate = 0;

            x.detail.forEach(item => {


              vat_flag = item.vat_flag;
              vat_rate = (!Number(item.vat_rate) ? 0 : Number(item.vat_rate));

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
                delivery_no: new FormControl({ value: item.delivery_no, disabled: true }),
                delivery_date: new FormControl({ value: item.delivery_date, disabled: true }),
                tax_invoice_no: new FormControl({ value: item.tax_invoice_no, disabled: true }),
                license_no: new FormControl({ value: item.license_no, disabled: true }),
                branch_id: new FormControl({ value: item.branch_id, disabled: true }),
                branch_code: new FormControl({ value: item.branch_code, disabled: true }),
                line_remark: new FormControl({ value: item.line_remark, disabled: true }),
                line_status: new FormControl({ value: item.line_status, disabled: true }),
                cost_inc_vat: new FormControl({ value: item.cost_inc_vat, disabled: true }),
                vat_flag: new FormControl({ value: item.vat_flag, disabled: true }),
                vat_rate: new FormControl({ value: item.vat_rate, disabled: true }),
                cost_vat: new FormControl({ value: item.cost_vat, disabled: true }),
                whl_code: new FormControl({ value: item.whl_code, disabled: true }),
                part_code:new FormControl({ value: item.part_code, disabled: true }),
                part_name:new FormControl({ value: item.part_name, disabled: true }),
                receive_qty:new FormControl({ value: item.receive_qty, disabled: true }),
              });
              this.DetailList.push(fg);
            });

            this.formGroup.patchValue({
              vat_flag: vat_flag,
              vat_rate: vat_rate,
            });

            this.detailreInitDatatable();
          }
          this.s_loader.onEnd();
        }, () => toastr.error(message.error));
    });

  }

  detailinitDatatable(): void {
    let table: any = $('table.detail-dataTable');
    this.detaildataTable = table.DataTable({
      scrollY: '50vh',
      scrollCollapse: true,
      paging: false,
      searching: false,
      ordering: false,
      info: false
    });
  }

  detailreInitDatatable(): void {
    this.detaildestroyDatatable()
    setTimeout(() => this.detailinitDatatable(), 0)
  }

  detaildestroyDatatable() {
    if (this.detaildataTable) {
      this.detaildataTable.destroy();
      this.detaildataTable = null;
    }
  }

  get DetailList(): FormArray {
    return this.formGroup.get('detail') as FormArray;
  }


}

