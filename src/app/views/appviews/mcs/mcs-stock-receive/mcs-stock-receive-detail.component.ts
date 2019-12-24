import { Component, OnInit } from '@angular/core';
import { setLocalDate } from 'app/app.config';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoaderService } from 'app/core/loader/loader.service';
import { MyDatePickerOptions } from 'app/app.config';
import { McsStockReceiveService } from './mcs-stock-receive.service';
import { ReceiveD, LoadingEntities, AutoCompleteModel, ReceiveDetail } from './mcs-stock-receive.interface';
import { tap, finalize } from 'rxjs/operators';
import { UserService } from 'app/services/users';
import { IUserResCookie } from 'app/interfaces/users';
import { message } from 'app/app.message';
import { Router } from '@angular/router';
import * as $ from 'jquery';


declare var toastr: any;

@Component({
  selector: 'app-mcs-stock-receive-detail',
  templateUrl: './mcs-stock-receive-detail.component.html',
  styleUrls: ['./mcs-stock-receive-detail.component.scss']
})
export class McsStockReceiveDetailComponent implements OnInit {


  public headers: Array<string> = new Array("ลำดับ", "ยี่ห้อ", "รุ่น", "แบบ", "สี", "หมายเลขเครื่อง", "หมายเลขตัวถัง", "เลขที่ใบแจ้งหนี้", "ราคา(ไม่รวม VAT)", "ค่าอื่นๆ", "ค่าซ่อม", "สถานที่เก็บ", "ตำแหน่งคลัง");

  public code: string;
  myDatePickerOptions = MyDatePickerOptions;
  displayLocalDate = setLocalDate;
  formGroup: FormGroup;
  mUser: IUserResCookie;
  Data = new BehaviorSubject(null);
  LoadingEnt = LoadingEntities;
  loading: number;
  dataTable: any;
  AC_Branch: AutoCompleteModel[];
  AC_Dealer: AutoCompleteModel[];
  AC_User: AutoCompleteModel[];
  AC_Type: AutoCompleteModel[];
  AC_Status: AutoCompleteModel[];
  AC_Warehouse: AutoCompleteModel[];

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
    // this.s_service.GetBranchAutoComplete().subscribe(x => {
    //   this.AC_Branch = x;
    // });

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

    // this.s_service.get_wh_all().subscribe(x => {
    //   this.AC_Warehouse = x;
    // });

    // this.s_service.get_cat().subscribe(x => {
    //   this.AC_PrdCategory = x;
    // });
    // this.s_service.GetBrandAutoComplete().subscribe(x => {
    //   this.AC_PrdBrand = x;
    // });
    // this.s_service.GetModelAutoComplete().subscribe(x => {
    //   this.AC_PrdModel = x;
    // });
    // this.s_service.GetTypeAutoComplete().subscribe(x => {
    //   this.AC_PrdType = x;
    // });
    // this.s_service.GetColorAutoComplete().subscribe(x => {
    //   this.AC_PrdColor = x;
    // });

    this.loading = 1;
    this.mUser = this.s_user.cookies;

    var today = new Date();
    this.formGroup = this.fb.group({
      id: new FormControl({ value: null, disabled: true }),
      receive_no: new FormControl({ value: null, disabled: true }),
      receive_id: new FormControl({ value: this.s_user.cookies.id, disabled: true }),
      receive_date: new FormControl({ value: today, disabled: true }),
      receive_status: new FormControl({ value: 1, disabled: true }),
      receive_type: new FormControl({ value: 1, disabled: true }),

      dealer_code: new FormControl({ value: null, disabled: true }),
      purchase_no: new FormControl({ value: null, disabled: true }),
      remark: new FormControl({ value: null, disabled: true }),
      create_id: new FormControl({ value: this.s_user.cookies.id, disabled: true }),
      create_date: new FormControl({ value: today, disabled: true }),

      update_id: new FormControl({ value: null, disabled: true }),
      update_date: new FormControl({ value: null, disabled: true }),

      delivery_code: new FormControl({ value: null, disabled: true }),
      delivery_date: new FormControl({ value: null, disabled: true }),

      cost_inc_vat: new FormControl({ value: 0, disabled: true }),
      vat_flag: new FormControl({ value: '', disabled: true }),
      vat_rate: new FormControl({ value: 0, disabled: true, }),
      cost_vat: new FormControl({ value: 0, disabled: true }),
      cost_exc_vat: new FormControl({ value: 0, disabled: true }),
      cost_other_repair: new FormControl({ value: 0, disabled: true }),
      cost_total: new FormControl({ value: 0, disabled: true }),
      detail: this.fb.array([])
    });

    this.DetailList.valueChanges.subscribe(x => {

      var cost_exc_vat = 0;
      var total_vat = 0;
      var cost_other_exc_vat = 0;
      var cost_repair_exc_vat = 0;

      cost_exc_vat += x.reduce((a, c) => a += (!Number(c.cost_exc_vat) ? 0 : Number(c.cost_exc_vat)), 0);
      cost_other_exc_vat += x.reduce((a, c) => a += (!Number(c.cost_other_exc_vat) ? 0 : Number(c.cost_other_exc_vat)), 0);
      cost_repair_exc_vat += x.reduce((a, c) => a += (!Number(c.cost_repair_exc_vat) ? 0 : Number(c.cost_repair_exc_vat)), 0);
      total_vat = x.reduce((a, c) => a += (!Number(c.cost_exc_vat) || !Number(c.vat_rate) ? 0 : (Number(c.cost_exc_vat) / 100) * Number(c.vat_rate)), 0);


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

              
              // //var branch_code = (!this.AC_Branch.find(x => x.value == item.branch_id) ? '' : this.AC_Branch.find(x => x.value == item.branch_id).text);
              // var cat = (!this.AC_PrdCategory.find(x => x.value == item.cat_id) ? '' : this.AC_PrdCategory.find(x => x.value == item.cat_id).text);
              // var brand = (!this.AC_PrdBrand.find(x => x.value == item.brand_id) ? '' : this.AC_PrdBrand.find(x => x.value == item.brand_id).text);
              // var model = (!this.AC_PrdModel.find(x => x.value == item.model_id) ? '' : this.AC_PrdModel.find(x => x.value == item.model_id).text);
              // var type = (!this.AC_PrdType.find(x => x.value == item.type_id) ? '' : this.AC_PrdType.find(x => x.value == item.type_id).text);
              // var color = (!this.AC_PrdColor.find(x => x.value == item.color_id) ? '' : this.AC_PrdColor.find(x => x.value == item.color_id).text);

              // var id_model = (!this.AC_PrdModel.find(x => x.value == item.model_id) ? 0 : this.AC_PrdModel.find(x => x.value == item.model_id).value);
              // var id_type = (!this.AC_PrdType.find(x => x.value == item.type_id) ? 0 : this.AC_PrdType.find(x => x.value == item.type_id).value);
              // var id_color = (!this.AC_PrdColor.find(x => x.value == item.color_id) ? 0 : this.AC_PrdColor.find(x => x.value == item.color_id).value);

              vat_flag = item.vat_flag;
              vat_rate = (!Number(item.vat_rate) ? 0 : Number(item.vat_rate));

              const fg = this.fb.group({
                cat_id: new FormControl({ value: item.cat_id, disabled: false }),
                brand_id: new FormControl({ value: item.brand_id, disabled: false }),
                model_id: new FormControl({ value: item.model_id, disabled: false }),
                type_id: new FormControl({ value: item.type_id, disabled: false }),
                color_id: new FormControl({ value: item.color_id, disabled: false }),
                engine_no: new FormControl({ value: item.engine_no, disabled: false }),
                frame_no: new FormControl({ value: item.frame_no, disabled: false }),
                invoice_no: new FormControl({ value: item.invoice_no, disabled: false }),
                cost_exc_vat: new FormControl({ value: item.cost_exc_vat, disabled: false }),
                cost_other_exc_vat: new FormControl({ value: item.cost_other_exc_vat, disabled: false }),
                cost_repair_exc_vat: new FormControl({ value: item.cost_repair_exc_vat, disabled: false }),

                cat_code: new FormControl({ value: item.cat_code, disabled: false }),
                brand_code: new FormControl({ value: item.brand_code, disabled: false }),
                model_code: new FormControl({ value: item.model_code, disabled: false }),
                type_code: new FormControl({ value: item.type_code, disabled: false }),
                color_code: new FormControl({ value: item.color_code, disabled: false }),

                id: new FormControl({ value: item.id, disabled: false }),
                receive_no: new FormControl({ value: item.receive_no, disabled: false }),
                dealer_code: new FormControl({ value: item.dealer_code, disabled: false }),
                delivery_code: new FormControl({ value: item.delivery_code, disabled: false }),
                delivery_date: new FormControl({ value: item.delivery_date, disabled: false }),
                tax_invoice_no: new FormControl({ value: item.tax_invoice_no, disabled: false }),
                license_no: new FormControl({ value: item.license_no, disabled: false }),
                branch_id: new FormControl({ value: item.branch_id, disabled: false }),
                branch_code: new FormControl({ value: item.branch_code, disabled: false }),
                line_remark: new FormControl({ value: item.line_remark, disabled: false }),
                line_status: new FormControl({ value: 1, disabled: false }),
                cost_inc_vat: new FormControl({ value: item.cost_inc_vat, disabled: false }),
                vat_flag: new FormControl({ value: item.vat_flag, disabled: false }),
                vat_rate: new FormControl({ value: item.vat_rate, disabled: false }),
                cost_vat: new FormControl({ value: (item.cost_exc_vat / 100) * item.vat_rate, disabled: false }),
                whl_code: new FormControl({ value: item.whl_code, disabled: false }),
                
              });
              this.DetailList.push(fg);
            });

            this.formGroup.patchValue({
              vat_flag: vat_flag,
              vat_rate: vat_rate,
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

