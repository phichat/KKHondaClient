import { Component, OnInit } from '@angular/core';

import { setLocalDate } from 'app/app.config';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { LoaderService } from 'app/core/loader/loader.service';
import { appConfig } from 'app/app.config';
import { message } from 'app/app.message';
import { McsSavePoService } from './mcs-save-po.service';
import { savePO_Detail } from './mcs-save-po.interface';
import { LoadingEntities } from 'app/entities/loading.entities';

import { UserService } from 'app/services/users';
import { IUserResCookie } from 'app/interfaces/users';

import * as $ from 'jquery';

declare var toastr: any;

@Component({
  selector: 'app-mcs-save-po-detail',
  templateUrl: './mcs-save-po-detail.component.html',
  styleUrls: ['./mcs-save-po-detail.component.scss']
})
export class McsSavePoDetailComponent implements OnInit {

  public code: string;
  displayLocalDate = setLocalDate;
  formGroup: FormGroup;
  mUser: IUserResCookie;
  Data = new BehaviorSubject(null);
  LoadingEntities = LoadingEntities;
  loading: number;
  dataTable: any;

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private s_loader: LoaderService,
    private s_Po: McsSavePoService,
    private s_user: UserService,
  ) {
  }

  ngOnInit() {

    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }

    this.mUser = this.s_user.cookies;
    this.formGroup = this.fb.group({
      po_id: new FormControl({ value: null, disabled: true }),
      po_no: new FormControl({ value: null, disabled: true }),
      status: new FormControl({ value: null, disabled: true }),
      status_desc: new FormControl({ value: null, disabled: true }),
      po_date: new FormControl({ value: null, disabled: true }),
      due_date: new FormControl({ value: null, disabled: true }),
      supplier_id: new FormControl({ value: null, disabled: true }),
      supplier_name: new FormControl({ value: null, disabled: true }),
      remark: new FormControl({ value: null, disabled: true }),
      create_id: new FormControl({ value: null, disabled: true }),
      create_name: new FormControl({ value: null, disabled: true }),
      create_date: new FormControl({ value: null, disabled: true }),
      update_id: new FormControl({ value: null, disabled: true }),
      update_name: new FormControl({ value: null, disabled: true }),
      update_date: new FormControl({ value: null, disabled: true }),

      cash_flag: new FormControl({ value: null, disabled: true }),
      cash_price: new FormControl({ value: null, disabled: true }),

      cheque_flag: new FormControl({ value: null, disabled: true }),
      cheque_bank_id: new FormControl({ value: null, disabled: true }),
      cheque_branch: new FormControl({ value: null, disabled: true }),
      cheque_no: new FormControl({ value: null, disabled: true }),
      cheque_date: new FormControl({ value: null, disabled: true }),
      cheque_price: new FormControl({ value: null, disabled: true }),

      total_price: new FormControl({ value: null, disabled: true }),
      vat_flag: new FormControl({ value: null, disabled: true }),
      total_vat: new FormControl({ value: null, disabled: true }),
      total_vat_price: new FormControl({ value: null, disabled: true }),
      total_net_price: new FormControl({ value: null, disabled: true }),

      detail: this.fb.array([])
    });

    this.activeRoute.params.subscribe(o => {
      this.code = o['code'];

      this.s_Po.GetDetail(`${this.code}`)
        .pipe(tap(() => this.s_loader.show()))
        .subscribe((x: savePO_Detail) => {

          this.formGroup.patchValue({ ...x, po_no: `${x.po_no}` });

          const data = {
            total_price: x.total_price,
            vat_flag: x.vat_flag,
            total_vat: x.total_vat,
            total_vat_price: x.total_vat_price,
            total_net_price: x.total_vat_price,
          }
          this.Data.next(data);

          if (!x.detail.length) {
            this.loading = this.LoadingEntities.noRecord;
          } else {

            x.detail.forEach(item => {
              const fg = this.fb.group({ ...item });
              this.DetailPo.push(fg);
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

  get DetailPo(): FormArray {
    return this.formGroup.get('detail') as FormArray;
  }

  addDetail() {
    const fg = this.fb.group({ 
      po_no:this.code,
      cat_id: null,
      cat_name: null,
      brand_id: null,
      brand_name: null,
      model_id: null,
      model_name: null,
      type_id: null,
      type_name: null,
      color_id: null,
      color_name: null,
      unit_price: null,
      unit_qty: null,
     });
    this.DetailPo.push(fg);
  }


}
