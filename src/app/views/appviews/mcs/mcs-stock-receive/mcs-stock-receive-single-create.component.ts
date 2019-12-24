import { Component, OnInit } from '@angular/core';
import { setLocalDate } from 'app/app.config';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
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
      receive_id: new FormControl({ value: this.s_user.cookies.id, disabled: false }),
      receive_date: new FormControl({ value: today, disabled: false }),
      receive_status: new FormControl({ value: 2, disabled: false }),
      receive_type: new FormControl({ value: 2, disabled: true }),

      dealer_code: new FormControl({ value: 'AP-11', disabled: false }),
      transfer_code: new FormControl({ value: 'AP-11', disabled: false }),
      purchase_no: new FormControl({ value: null, disabled: false }),
      remark: new FormControl({ value: null, disabled: false }),
      create_id: new FormControl({ value: this.s_user.cookies.id, disabled: false }),
      create_date: new FormControl({ value: today, disabled: false }),

      update_id: new FormControl({ value: null, disabled: false }),
      update_date: new FormControl({ value: null, disabled: false }),

      delivery_code: new FormControl({ value: null, disabled: false }),
      delivery_date: new FormControl({ value: null, disabled: false }),

      // cost_inc_vat: new FormControl({ value: 0, disabled: false }),
      // vat_flag: new FormControl({ value: '', disabled: false }),
      // vat_rate: new FormControl({ value: 0, disabled: false, }),
      // cost_vat: new FormControl({ value: 0, disabled: false }),
      // cost_exc_vat: new FormControl({ value: 0, disabled: false }),
      // cost_other_exc_vat: new FormControl({ value: 0, disabled: false }),
      // cost_repair_exc_vat: new FormControl({ value: 0, disabled: false }),
      // cost_total: new FormControl({ value: 0, disabled: false }),
      detail: this.fb.array([])
    });

    const fg = this.fb.group({
      cat_id: new FormControl({ value: null, disabled: false }),
      brand_id: new FormControl({ value: null, disabled: false }),
      model_id: new FormControl({ value: null, disabled: false }),
      type_id: new FormControl({ value: null, disabled: false }),
      color_id: new FormControl({ value: null, disabled: false }),
      engine_no: new FormControl({ value: null, disabled: false }),
      frame_no: new FormControl({ value: null, disabled: false }),
      invoice_no: new FormControl({ value: null, disabled: false }),
      cost_exc_vat: new FormControl({ value: 0, disabled: false }),
      cost_other_exc_vat: new FormControl({ value: 0, disabled: false }),
      cost_repair_exc_vat: new FormControl({ value: 0, disabled: false }),

      province_id: new FormControl({ value: null, disabled: false }),

      id: new FormControl({ value: null, disabled: false }),
      receive_no: new FormControl({ value: null, disabled: false }),
      dealer_no: new FormControl({ value: null, disabled: false }),
      delivery_no: new FormControl({ value: null, disabled: false }),
      delivery_date: new FormControl({ value: null, disabled: false }),
      tax_invoice_no: new FormControl({ value: null, disabled: false }),
      license_no: new FormControl({ value: null, disabled: false }),
      branch_id: new FormControl({ value: null, disabled: false }),
      branch_name: new FormControl({ value: null, disabled: false }),
      line_remark: new FormControl({ value: null, disabled: false }),
      line_status: new FormControl({ value: 1, disabled: false }),
      cost_inc_vat: new FormControl({ value: 0, disabled: false }),
      vat_flag: new FormControl({ value: '', disabled: false }),
      vat_rate: new FormControl({ value: 0, disabled: false }),
      cost_vat: new FormControl({ value: 0, disabled: false }),
    });
    this.DetailList.push(fg);

    this.DetailList.valueChanges.subscribe(x => {

      var index = 0;
      var cost_exc_vat = x[index].cost_exc_vat;
      var vat_flag = x[index].vat_flag;
      var vat_rate = (x[index].vat_flag ? 7 : 0);
      var cost_vat = (x[index].vat_flag ? (x[index].cost_exc_vat / 100) * 7 : 0);
      var cost_inc_vat = x[index].cost_exc_vat + (x[index].vat_flag ? (x[index].cost_exc_vat / 100) * 7 : 0);
      var cost_other_exc_vat = x[index].cost_other_exc_vat;
      var cost_repair_exc_vat = x[index].cost_repair_exc_vat;



      // (this.DetailList.controls[index]['cost_exc_vat']).patchValue(cost_exc_vat);
      // (this.DetailList.controls[index]['vat_flag']).patchValue(vat_flag);
      // (this.DetailList.controls[index]['vat_rate']).patchValue(vat_rate);
      // (this.DetailList.controls[index]['cost_vat']).patchValue(cost_vat);
      // (this.DetailList.controls[index]['cost_inc_vat']).patchValue(cost_inc_vat);
      // (this.DetailList.controls[index]['cost_other_exc_vat']).patchValue(cost_other_exc_vat);
      // (this.DetailList.controls[index]['cost_repair_exc_vat']).patchValue(cost_repair_exc_vat);

      // this.formGroup.patchValue({
      // detail: [
      //   {
      //     cost_exc_vat: x.detail[0].cost_exc_vat,
      //     vat_flag: x.detail[0].vat_flag,
      //     vat_rate: (x.detail[0].vat_flag ? 7 : 0),
      //     cost_vat: (x.detail[0].vat_flag ? (x.detail[0].cost_exc_vat/100) * 7 : 0),
      //     cost_inc_vat: x.detail[0].cost_exc_vat + (x.detail[0].vat_flag ? (x.detail[0].cost_exc_vat/100) * 7 : 0),
      //     cost_other_exc_vat: x.detail[0].cost_other_exc_vat,
      //     cost_repair_exc_vat: x.detail[0].cost_repair_exc_vat,
      //   }
      // ]
      // });

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


  onSubmit() {
    this.s_loader.showLoader()
    let f = this.formGroup.getRawValue();
    this.s_service.ReceiveCreate(f)
      .pipe(finalize(() => this.s_loader.onEnd()))
      .subscribe(() => {
        toastr.success(message.created);
        this.route.navigate(['mcs/mcs-stock-receive-list']);
      }, () => toastr.error(message.failed));
  }


  debug() {
    let data = this.formGroup.getRawValue();

    console.log(data);
  }

}



