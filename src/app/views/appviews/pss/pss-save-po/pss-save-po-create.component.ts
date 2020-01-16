import { Component, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { setZeroHours } from 'app/app.config';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription, of } from 'rxjs';
import { LoaderService } from 'app/core/loader/loader.service';
import { PssSavePoService } from './pss-save-po.service';
import { LoadingEntities, AutoCompleteModel, ItemDetail } from './pss-save-po.interface';
import { finalize, tap, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { UserService } from 'app/services/users';
import { IUserResCookie } from 'app/interfaces/users';
import { message } from 'app/app.message';
import { Router } from '@angular/router';
import * as $ from 'jquery';


declare var toastr: any;

@Component({
  selector: 'app-pss-save-po-create',
  templateUrl: './pss-save-po-create.component.html',
  styleUrls: ['./pss-save-po-create.component.scss']
})
export class PssSavePoCreateComponent implements OnInit {


  public code: string;
  // myDatePickerOptions = MyDatePickerOptions;
  // displayLocalDate = setLocalDate;
  formGroup: FormGroup;
  //formGroupItem: FormGroup;

  protected formGroupItem = new FormGroup({
    item_id: new FormControl(null),
    item_code: new FormControl(null),
    item_name: new FormControl(null),
    cost_discount: new FormControl(null),
    po_qty: new FormControl(null),
    cost_exc_vat: new FormControl(null),
    total: new FormControl(null),
    vat_rate: new FormControl(null),
    vat_flag: new FormControl(null),
  })

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
    public chRef: ChangeDetectorRef,
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

    let today = new Date();


    this.formGroup = this.fb.group({
      po_no: new FormControl({ value: null, disabled: true }),
      branch_id: new FormControl({ value: this.mUser.branchId, disabled: false }, Validators.required),
      dealer_code: new FormControl({ value: null, disabled: false }, Validators.required),
      po_type: new FormControl({ value: 3, disabled: true }),
      po_status: new FormControl({ value: 2, disabled: true }),

      po_date: new FormControl({ value: today, disabled: false }, Validators.required),
      delivery_date: new FormControl({ value: null, disabled: false }),
      contact_name: new FormControl({ value: null, disabled: false }),
      contact_phone: new FormControl({ value: null, disabled: false }),
      contact_fax: new FormControl({ value: null, disabled: false }),
      po_remark: new FormControl({ value: null, disabled: false }),
      create_id: new FormControl({ value: this.mUser.id, disabled: false }),

      detail: this.fb.array([]),

      chk_vat: new FormControl({ value: false, disabled: false }),
      vat_rate: new FormControl({ value: 0, disabled: false }),
      vat_flag: new FormControl({ value: null, disabled: false }),
      total_exc_vat: new FormControl({ value: 0.00, disabled: false }),
      total_discount: new FormControl({ value: 0.00, disabled: false }),
      total_exc_vat_discount: new FormControl({ value: 0.00, disabled: false }),
      total_vat: new FormControl({ value: 0.00, disabled: false }),
      total: new FormControl({ value: 0.00, disabled: false }),
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

    this.searchItem();
  }

  checkVat() {
    let f = this.formGroup.getRawValue();
    this.formGroup.patchValue({
      vat_flag: (f.chk_vat ? 'Y' : null),
      vat_rate: (f.chk_vat ? 7 : 0),
    });

    for (let index = 0; index < this.DetailList.value.length; index++) {

      this.DetailList.at(index).patchValue({
        vat_flag: (f.chk_vat ? 'Y' : null),
        vat_rate: (f.chk_vat ? 7 : 0),
      });

    }
  }
  protected Itemhead = new EventEmitter<string>();
  protected searchItemLoading: boolean;
  protected dropdownLoadingTxt: string;
  protected ItemDropdown = new Array<ItemDetail>();
  searchItem() {
    this.Itemhead.pipe(
      tap(() => {
        this.searchItemLoading = true;
        this.dropdownLoadingTxt = message.loading;
      }),
      distinctUntilChanged(),
      debounceTime(100),
      switchMap(key => {
        if (key == '') return of(new Array<ItemDetail>());
        return this.s_service.GetItemKeyword(key);
      })
    ).subscribe(x => {
      if (!x.length) {
        this.ItemUnload();
        this.ItemDropdown = new Array<ItemDetail>();
      }
      this.chRef.markForCheck();
      this.ItemUnload();
      this.ItemDropdown = x;
      this.ItemDropdown.map(item => {
        item.text = `${item.item_code}`;
        item.value = item.item_id;
      });
    }, () => {
      this.ItemUnload();
      this.ItemDropdown = new Array<ItemDetail>();
    });
  }
  protected ItemUnload() {
    this.searchItemLoading = false;
    this.dropdownLoadingTxt = '';
  }
  selectItem(e: ItemDetail) {
    if (!e)
      this.formGroupItem.reset();

    const fg = this.formGroupItem.getRawValue();
    console.log(fg);
    this.formGroupItem.patchValue({
      ...fg, ...e, cost_exc_vat: e.item_cost
    });
  }
  removeItem(index: number) {
    this.DetailList.removeAt(index);
  }

  orderChange() {
    const fg = this.formGroupItem.getRawValue();
    if (fg.po_qty > 0 && fg.cost_exc_vat > 0) {
      const total = (fg.po_qty * fg.cost_exc_vat) - fg.cost_discount;
      this.formGroupItem.patchValue({ total });
    }
  }

  rowOrderChange(index: number) {
    const fg = this.DetailList.at(index).value;
    if (fg.po_qty > 0 && fg.cost_exc_vat > 0) {

      const total = (fg.po_qty * fg.cost_exc_vat) - fg.cost_discount;

      this.DetailList.at(index).patchValue({ total });
    }
  }
  addItem() {
    let fg = this.formGroupItem.getRawValue();
    fg = {
      item_id: fg.item_id,
      item_code: fg.item_code,
      item_name: fg.item_name,
      po_qty: fg.po_qty,
      cost_exc_vat: fg.cost_exc_vat,
      cost_discount: fg.cost_discount,
      total: fg.total
    };
    this.DetailList.push(this.fb.group(fg));
    this.formGroupItem.reset();
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
  detaildelete(index: number) {
    this.DetailList.removeAt(index);
    this.reInitDatatable();
  }

  debug() {
    let f = this.formGroup.getRawValue();
    f = {
      ...f,
      po_date: setZeroHours(f.po_date),
      delivery_date: setZeroHours(f.delivery_date)
    }
    console.log(f);
  }

  onSubmit() {
    this.s_loader.showLoader()
    let f = this.formGroup.getRawValue();
    f = {
      ...f,
      po_date: setZeroHours(f.po_date),
      delivery_date: setZeroHours(f.delivery_date)
    }
    this.s_service.create_purchase(f)
      .pipe(finalize(() => this.s_loader.onEnd()))
      .subscribe(() => {
        toastr.success(message.created);
        this.route.navigate(['pss/pss-save-po-list']);
      }, () => toastr.error(message.failed));
  }

}

