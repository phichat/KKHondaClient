import { Component, OnInit } from '@angular/core';
import { setLocalDate } from 'app/app.config';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoaderService } from 'app/core/loader/loader.service';
import { MyDatePickerOptions } from 'app/app.config';
import { PssSavePoService } from './pss-save-po.service';
import { LoadingEntities, AutoCompleteModel, PurchaseHead, PurchaseDetail } from './pss-save-po.interface';
import { tap } from 'rxjs/operators';
import { UserService } from 'app/services/users';
import { IUserResCookie } from 'app/interfaces/users';
import { message } from 'app/app.message';
import { Router } from '@angular/router';
import * as $ from 'jquery';


declare var toastr: any;

@Component({
  selector: 'app-pss-save-po-detail',
  templateUrl: './pss-save-po-detail.component.html',
  styleUrls: ['./pss-save-po-detail.component.scss']
})
export class PssSavePoDetailComponent implements OnInit {

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

  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private s_loader: LoaderService,
    private s_service: PssSavePoService,
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
    this.s_service.get_autocomplete('PO_STATUS').subscribe(x => {
      this.AC_Status = x;
    });

    this.loading = 1;
    this.mUser = this.s_user.cookies;

    var today = new Date();
    this.formGroup = this.fb.group({
      po_no: new FormControl({ value: null, disabled: true }),
      branch_id: new FormControl({ value: null, disabled: true }),
      dealer_code: new FormControl({ value: null, disabled: true }),
      po_type: new FormControl({ value: null, disabled: true }),
      po_status: new FormControl({ value: null, disabled: true }),

      po_date: new FormControl({ value: null, disabled: true }),
      delivery_date: new FormControl({ value: null, disabled: true }),
      contact_name: new FormControl({ value: null, disabled: true }),
      contact_phone: new FormControl({ value: null, disabled: true }),
      contact_fax: new FormControl({ value: null, disabled: true }),
      po_remark: new FormControl({ value: null, disabled: true }),
      create_id: new FormControl({ value: this.mUser.id, disabled: true }),

      detail: this.fb.array([]),

      chk_vat: new FormControl({ value: null, disabled: true }),
      vat_rate: new FormControl({ value: null, disabled: true }),
      vat_flag: new FormControl({ value: null, disabled: true }),
      total_exc_vat: new FormControl({ value: null, disabled: true }),
      total_discount: new FormControl({ value: null, disabled: true }),
      total_exc_vat_discount: new FormControl({ value: null, disabled: true }),
      total_vat: new FormControl({ value: null, disabled: true }),
      total: new FormControl({ value: null, disabled: true }),
    });

    this.DetailList.valueChanges.subscribe(x => {

      let f = this.formGroup.getRawValue();

      var _total_exc_vat = x.reduce((a, c) => a += (!(Number(c.cost_exc_vat) * Number(c.po_qty)) ? 0 : (Number(c.cost_exc_vat) * Number(c.po_qty))), 0);
      var _total_discount = x.reduce((a, c) => a += (!Number(c.cost_discount) ? 0 : Number(c.cost_discount)), 0);
      var _total_exc_vat_discount = _total_exc_vat - _total_discount;
      var _total_vat = (_total_exc_vat_discount / 100) * f.vat_rate;
      var _total = _total_exc_vat_discount + _total_vat;

      this.formGroup.patchValue({
        total_exc_vat: _total_exc_vat,
        total_discount: _total_discount,
        total_exc_vat_discount: _total_exc_vat_discount,
        total_vat: _total_vat,
        total: _total,
      });

    });

    this.activeRoute.params.subscribe(o => {
      this.code = o['code'];

      this.s_service.purchase_detail(`${this.code}`)
        .pipe(tap(() => this.s_loader.show()))
        .subscribe((x: PurchaseHead) => {

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
                item_id: new FormControl({ value: item.item_id, disabled: true }),
                item_code: new FormControl({ value: item.item_code, disabled: true }),
                item_name: new FormControl({ value: item.item_name, disabled: true }),
                po_qty: new FormControl({ value: item.po_qty, disabled: true }),
                cost_exc_vat: new FormControl({ value: item.cost_exc_vat, disabled: true }),
                cost_discount: new FormControl({ value: item.cost_discount, disabled: true }),
                total: new FormControl({ value: null, disabled: true }),
              });
              this.DetailList.push(fg);
            });

            this.formGroup.patchValue({
              chk_vat: (vat_flag == "Y" ? true : false),
              vat_flag: vat_flag,
              vat_rate: vat_rate,
            });

            for (let index = 0; index < this.DetailList.value.length; index++) {
              this.DetailList.at(index).patchValue({
                total: 0
              });
            }

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

