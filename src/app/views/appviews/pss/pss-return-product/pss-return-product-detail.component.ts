import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { setLocalDate } from 'app/app.config';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoaderService } from 'app/core/loader/loader.service';
import { PssReturnProductService } from './pss-return-product.service';
import {LoadingEntities, AutoCompleteModel, ReturnHead} from './pss-return-product.interface';
import { tap, finalize } from 'rxjs/operators';
import { UserService } from 'app/services/users';
import { IUserResCookie } from 'app/interfaces/users';
import { message } from 'app/app.message';
import { Router } from '@angular/router';
import * as $ from 'jquery';

declare var toastr: any;

@Component({
  selector: 'app-pss-return-product-detail',
  templateUrl: './pss-return-product-detail.component.html',
  styleUrls: ['./pss-return-product-detail.component.scss']
})
export class PssReturnProductDetailComponent implements OnInit {


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

  // list: ReceiveD[] = [];
  // search_list: searchlist[] = [];

  subscription: Subscription;
  constructor(
    private fb: FormBuilder,
    private searchfb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private s_loader: LoaderService,
    private s_service: PssReturnProductService,
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
    this.s_service.get_autocomplete('RET_STATUS').subscribe(x => {
      this.AC_Status = x;
    });


    this.loading = this.LoadingEnt.noRecord;
    this.mUser = this.s_user.cookies;

    let today = new Date();


    this.formGroup = this.fb.group({
      return_no: new FormControl({ value: null, disabled: true }),
      return_date: new FormControl({ value: null, disabled: true }, Validators.required),
      return_type: new FormControl({ value: null, disabled: true }, Validators.required),
      return_status: new FormControl({ value: null, disabled: true }, Validators.required),

      dealer_code: new FormControl({ value: null, disabled: true }, Validators.required),
      receive_no: new FormControl({ value: null, disabled: true }, Validators.required),
      receive_date: new FormControl({ value: null, disabled: true }),

      remark: new FormControl({ value: null, disabled: true }),
      create_id: new FormControl({ value: null, disabled: true }, Validators.required),
      total: new FormControl({ value: 0, disabled: true }),
      detail: this.fb.array([]),

    });

    this.DetailList.valueChanges.subscribe(x => {
      var total = 0;
      total += x.reduce((a, c) => a += (!(Number(c.return_qty) * Number(c.return_amt)) ? 0 : (Number(c.return_qty) * Number(c.return_amt))), 0);
      this.formGroup.patchValue({
        total: total
      });
    });

    this.activeRoute.params.subscribe(o => {
      this.code = o['code'];

      this.s_service.return_detail(`${this.code}`)
        .pipe(tap(() => this.s_loader.show()))
        .subscribe((x: ReturnHead) => {

          this.formGroup.patchValue({ ...x });

          if (!x.detail.length) {
            this.loading = this.LoadingEnt.noRecord;
          } else {

            x.detail.forEach(item => {

              const fg = this.fb.group({
                item_id: new FormControl({ value: item.item_id, disabled: false }),
                log_id: new FormControl({ value: item.log_id, disabled: false }),
                receive_no: new FormControl({ value: item.receive_no, disabled: false }),
                tax_invoice_no: new FormControl({ value: item.tax_invoice_no, disabled: false }),
                return_qty: new FormControl({ value: item.return_qty, disabled: false }),
                return_amt: new FormControl({ value: item.return_amt, disabled: false }),
                product_code: new FormControl({ value: item.item_id, disabled: false }),
                product_name: new FormControl({ value: item.item_name, disabled: false }),
              });
              this.DetailList.push(fg);
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

