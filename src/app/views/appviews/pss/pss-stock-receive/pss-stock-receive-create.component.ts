import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { setZeroHours } from 'app/app.config';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoaderService } from 'app/core/loader/loader.service';
import { PssStockReceiveService } from './pss-stock-receive.service';
import { ReceiveD, LoadingEntities, AutoCompleteModel, searchlist, line_select } from './pss-stock-receive.interface';
import { tap, finalize } from 'rxjs/operators';
import { UserService } from 'app/services/users';
import { IUserResCookie } from 'app/interfaces/users';
import { message } from 'app/app.message';
import { Router } from '@angular/router';
import * as $ from 'jquery';

declare var toastr: any;

@Component({
  selector: 'app-pss-stock-receive-create',
  templateUrl: './pss-stock-receive-create.component.html',
  styleUrls: ['./pss-stock-receive-create.component.scss']
})
export class PssStockReceiveCreateComponent implements OnInit {


  public code: string;
  public checkedAll: boolean;
  // myDatePickerOptions = MyDatePickerOptions;
  // displayLocalDate = setLocalDate;
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

    let today = new Date();
    // var today = {
    //   date: {
    //     year: date.getFullYear(),
    //     month: date.getMonth() + 1,
    //     day: date.getDate()
    //   }
    // }


    this.formGroup = this.fb.group({
      id: new FormControl({ value: null, disabled: true }),
      receive_no: new FormControl({ value: null, disabled: true }),
      receive_id: new FormControl({ value: this.mUser.id, disabled: false }), // id ของผู้รับ(Branch ID จะหาจาก backend ครับ)
      receive_date: new FormControl({ value: today, disabled: false }, Validators.required),
      receive_status: new FormControl({ value: 2, disabled: true }),
      receive_type: new FormControl({ value: 3, disabled: true }),

      dealer_code: new FormControl({ value: null, disabled: false }, Validators.required),
      purchase_no: new FormControl({ value: null, disabled: false }),
      remark: new FormControl({ value: null, disabled: false }),
      create_id: new FormControl({ value: this.mUser.id, disabled: false }),
      create_date: new FormControl({ value: null, disabled: false }),

      update_id: new FormControl({ value: null, disabled: true }),
      update_date: new FormControl({ value: null, disabled: true }),

      delivery_code: new FormControl({ value: null, disabled: false }),
      delivery_date: new FormControl({ value: today, disabled: false }, Validators.required),

      cost_inc_vat: new FormControl({ value: 0, disabled: true }),
      vat_flag: new FormControl({ value: '', disabled: true }),
      vat_rate: new FormControl({ value: 0, disabled: true, }),
      cost_vat: new FormControl({ value: 0, disabled: true }),
      cost_exc_vat: new FormControl({ value: 0, disabled: true }),
      cost_other_repair: new FormControl({ value: 0, disabled: true }),
      cost_total: new FormControl({ value: 0, disabled: true }),

      detail: this.fb.array([]),

    });

    this.searchformGroup = this.searchfb.group({
      search: this.searchfb.array([]),
    });

    this.DetailList.valueChanges.subscribe(x => {
      var cost_exc_vat = 0;
      var total_vat = 0;
      var cost_other_exc_vat = 0;
      var cost_repair_exc_vat = 0;

      cost_exc_vat += x.reduce((a, c) => a += (!(Number(c.cost_exc_vat) * Number(c.r_qty)) ? 0 : (Number(c.cost_exc_vat) * Number(c.r_qty))), 0);
      cost_other_exc_vat += x.reduce((a, c) => a += (!(Number(c.cost_other_exc_vat) * Number(c.r_qty)) ? 0 : (Number(c.cost_other_exc_vat) * Number(c.r_qty))), 0);
      cost_repair_exc_vat += x.reduce((a, c) => a += (!(Number(c.cost_repair_exc_vat) * Number(c.r_qty)) ? 0 : (Number(c.cost_repair_exc_vat) * Number(c.r_qty))), 0);
      total_vat = x.reduce((a, c) => a += (!(Number(c.cost_exc_vat) * Number(c.r_qty)) || !Number(c.vat_rate) ? 0 : ((Number(c.cost_exc_vat) / 100) * Number(c.vat_rate)) * Number(c.r_qty)), 0);
      this.formGroup.patchValue({
        cost_other_repair: cost_other_exc_vat + cost_repair_exc_vat,
        cost_vat: total_vat,
        cost_total: cost_exc_vat + total_vat + (cost_other_exc_vat + cost_repair_exc_vat),
        cost_exc_vat: cost_exc_vat,
      });
    });

  }

  detailinitDatatable(): void {
    let table: any = $('table.detail-dataTable');
    this.detaildataTable = table.DataTable({
      scrollY: '50vh',
      scrollX: true,
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

  searchinitDatatable(): void {
    let table: any = $('table.search-dataTable');
    this.searchdataTable = table.DataTable({
      scrollY: '50vh',
      scrollCollapse: true,
      paging: false,
      searching: false,
      ordering: false,
      info: false
    });
  }

  searchreInitDatatable(): void {
    this.searchdestroyDatatable()
    setTimeout(() => this.searchinitDatatable(), 0)
  }

  searchdestroyDatatable() {
    if (this.searchdataTable) {
      this.searchdataTable.destroy();
      this.searchdataTable = null;
    }
  }

  get DetailList(): FormArray {
    return this.formGroup.get('detail') as FormArray;
  }

  get SearchList(): FormArray {
    return this.searchformGroup.get('search') as FormArray;
  }

  @ViewChild('file') file: ElementRef;
  readExcel(files: FileList) {
    this.s_loader.showLoader()
    this.s_service.UploadDcs(files, this.s_user.cookies.id)
      .pipe(finalize(() => this.s_loader.onEnd()))
      .subscribe(() => {
        toastr.success(message.created);
        this.file.nativeElement.value = null;
      },
        (err) => {
          toastr.error(err.error);
          this.file.nativeElement.value = null;
        }
      );
  }

  search_branch_id: string = null;
  search_whl_id: string = null;
  clearsearch() {
    (<HTMLInputElement>document.getElementById('log_ref')).value = '';
    (<HTMLInputElement>document.getElementById('part_code')).value = '';
    (<HTMLInputElement>document.getElementById('tax_no')).value = '';
    this.search_branch_id = null;
    this.search_whl_id = null;
    this.searchTransferlog()
  }

  searchTransferlog() {
    var log_ref = (<HTMLInputElement>document.getElementById('log_ref')).value;
    var part_code = (<HTMLInputElement>document.getElementById('part_code')).value;
    var tax_no = (<HTMLInputElement>document.getElementById('tax_no')).value;

    this.searchloading = this.searchLoadingEnt.loading
    this.s_service.SearchTransferLog(log_ref, part_code, tax_no)
      .pipe(tap(() => this.searchloading = this.searchLoadingEnt.loading))
      .subscribe(x => {
        console.log(x);
        while (this.SearchList.length) {
          this.SearchList.removeAt(0);
        }

        if (!x.length) {
          this.searchloading = this.searchLoadingEnt.noRecord;
          return;
        } else {

          x.forEach(item => {

            var qty = item.qty;
            var b_qty = item.b_qty;
            var p_qty = qty - b_qty;
            var r_qty = qty - b_qty;

            const searchfb = this.searchfb.group({
              IS_CHECKED: new FormControl({ value: false, disabled: false }),
              item_id: new FormControl({ value: item.item_id, disabled: false }),
              log_id: new FormControl({ value: item.log_id, disabled: false }),
              invoice_no: new FormControl({ value: item.invoice_no, disabled: false }),
              tax_no: new FormControl({ value: item.tax_no, disabled: false }),
              model_id: new FormControl({ value: item.model_id, disabled: false }),
              model_code: new FormControl({ value: item.model_code, disabled: false }),
              part_code: new FormControl({ value: item.part_code, disabled: false }),
              part_name: new FormControl({ value: item.part_name, disabled: false }),
              delivery_code: new FormControl({ value: item.delivery_code, disabled: false }),
              qty: new FormControl({ value: qty, disabled: false }),
              p_qty: new FormControl({ value: p_qty, disabled: false }),
              r_qty: new FormControl({ value: r_qty, disabled: false }),

              inv_amt: new FormControl({ value: item.inv_amt, disabled: false }),

            });
            this.SearchList.push(searchfb);
          });
          this.searchreInitDatatable();
        }

      }, () => this.searchloading = this.searchLoadingEnt.error)

    this.SearchList.valueChanges.subscribe((o: any[]) => {
      this.checkedAll = o.filter(x => x['IS_CHECKED'] == false).length ? false : true;
    })

  }

  checkAll(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    for (let index = 0; index < this.SearchList.value.length; index++) {
      this.SearchList.at(index).get('IS_CHECKED').patchValue(checkbox.checked);
    }
  }

  get getIsSelect(): any[] {
    return this.SearchList.value.filter(x => x.IS_CHECKED);
  }


  confirmTransferLog() {
    const x = this.getIsSelect;

    var vat_flag = 'Y';
    var vat_rate = 7;

    x.forEach(item => {
      // vat_flag = item.vat_flag;
      // vat_rate = (!Number(item.vat_rate) ? 0 : Number(item.vat_rate));

      var chk = this.DetailList.value.filter(x => x.invoice_no == item.invoice_no && x.part_code == item.part_code);
      if (chk.length > 0) {
        //Duplicate select
      } else {


        const fg = this.fb.group({

          id: new FormControl({ value: item.log_id, disabled: false }),
          receive_no: new FormControl({ value: null, disabled: false }),
          dealer_code: new FormControl({ value: item.dealer_code, disabled: false }),

          part_code: new FormControl({ value: item.part_code, disabled: false }),
          part_name: new FormControl({ value: item.part_name, disabled: false }),
          model_id: new FormControl({ value: item.model_id, disabled: false }),
          model_code: new FormControl({ value: item.model_code, disabled: false }),

          invoice_no: new FormControl({ value: item.invoice_no, disabled: false }),
          tax_invoice_no: new FormControl({ value: item.tax_no, disabled: false }),
          delivery_code: new FormControl({ value: item.delivery_code, disabled: false }),
          create_id: new FormControl({ value: null, disabled: false }),
          create_name: new FormControl({ value: null, disabled: false }),
          create_date: new FormControl({ value: null, disabled: false }),
          update_id: new FormControl({ value: null, disabled: false }),
          update_name: new FormControl({ value: null, disabled: false }),
          update_date: new FormControl({ value: null, disabled: false }),

          branch_id: new FormControl({ value: this.search_branch_id, disabled: false }, Validators.required),


          qty: new FormControl({ value: item.qty, disabled: false }),
          b_qty: new FormControl({ value: item.b_qty, disabled: false }),
          p_qty: new FormControl({ value: item.p_qty, disabled: false }),
          r_qty: new FormControl({ value: item.r_qty, disabled: false }, Validators.required),

          cost_inc_vat: new FormControl({ value: (item.inv_amt * 1.07), disabled: false }),
          vat_flag: new FormControl({ value: 'Y', disabled: false }),
          vat_rate: new FormControl({ value: 7, disabled: false }),
          cost_vat: new FormControl({ value: (item.inv_amt * 0.07), disabled: false }),
          cost_exc_vat: new FormControl({ value: item.inv_amt, disabled: false }, Validators.required),

          cost_other_exc_vat: new FormControl({ value: 0, disabled: false }),
          cost_repair_exc_vat: new FormControl({ value: 0, disabled: false }),
          whl_id: new FormControl({ value: this.search_whl_id, disabled: false }, Validators.required),
          item_id: new FormControl({ value: item.item_id, disabled: false }, Validators.required),
        });

        this.DetailList.push(fg);
      }

    })
    this.formGroup.patchValue({
      vat_flag: vat_flag,
      vat_rate: vat_rate,
    });
    this.detailreInitDatatable();
    this.reload_wh();
  }


  detaildelete(index: number) {
    this.DetailList.removeAt(index);
    this.detailreInitDatatable();
  }


  load_wh() {
    this.search_whl_id = null;
    this.s_service.get_wh(Number(this.search_branch_id)).subscribe(x => {
      this.AC_Warehouse = x;
    });
  }

  list_wh = [];
  load_wh_line(index: number) {

    this.DetailList.controls[index].patchValue({
      whl_id: null, //new FormControl({ value: null, disabled: false }, Validators.required),
    });

    //this.DetailList.controls[index] = null;
    this.reload_wh();
    console.log(this.list_wh);
    console.log(this.DetailList.controls[index]);
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


  onSubmit() {
    this.s_loader.showLoader()
    let f = this.formGroup.getRawValue();
    f = {
      ...f,
      receive_date: setZeroHours(f.receive_date),
      delivery_date: setZeroHours(f.delivery_date)
    }
    this.s_service.ReceiveCreate(f)
      .pipe(finalize(() => this.s_loader.onEnd()))
      .subscribe(() => {
        toastr.success(message.created);
        this.route.navigate(['pss/pss-stock-receive-list']);
      }, (err) => {
        toastr.error(err.error);
      });
  }


  debug() {
    let f = this.formGroup.getRawValue();
    f = {
      ...f,
      receive_date: setZeroHours(f.receive_date),
      delivery_date: setZeroHours(f.delivery_date)
    }
    console.log(f);
  }

}

