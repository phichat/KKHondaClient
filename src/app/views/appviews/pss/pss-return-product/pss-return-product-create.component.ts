import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { setZeroHours, setLocalDate } from 'app/app.config';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoaderService } from 'app/core/loader/loader.service';
import { PssReturnProductService } from './pss-return-product.service';
import { LoadingEntities, AutoCompleteModel, ReturnHead, ReturnDetail, SearchList, ReceiveList, ReturnAvailable } from './pss-return-product.interface';
import { tap, finalize } from 'rxjs/operators';
import { UserService } from 'app/services/users';
import { IUserResCookie } from 'app/interfaces/users';
import { message } from 'app/app.message';
import { Router } from '@angular/router';
import * as $ from 'jquery';

declare var toastr: any;

@Component({
  selector: 'app-pss-return-product-create',
  templateUrl: './pss-return-product-create.component.html',
  styleUrls: ['./pss-return-product-create.component.scss']
})
export class PssReturnProductCreateComponent implements OnInit {


  public code: string;
  public checkedAll: boolean;

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

  AC_Dealer: AutoCompleteModel[];
  AC_User: AutoCompleteModel[];
  AC_Type: AutoCompleteModel[];
  AC_Status: AutoCompleteModel[];
  AC_Receive: ReceiveList[];
  list: ReturnDetail[] = [];

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
      return_date: new FormControl({ value: today, disabled: false }, Validators.required),
      return_type: new FormControl({ value: 3, disabled: false }, Validators.required),
      return_status: new FormControl({ value: 2, disabled: false }, Validators.required),

      dealer_code: new FormControl({ value: 'AP-01', disabled: false }, Validators.required),
      receive_no: new FormControl({ value: null, disabled: true }, Validators.required),
      receive_date: new FormControl({ value: null, disabled: true }),

      remark: new FormControl({ value: null, disabled: false }),
      create_id: new FormControl({ value: this.mUser.id, disabled: false }, Validators.required),
      total: new FormControl({ value: 0, disabled: false }),
      detail: this.fb.array([]),

    });

    this.searchformGroup = this.searchfb.group({
      search: this.searchfb.array([]),
    });

    this.DetailList.valueChanges.subscribe(x => {
      var total = 0;
      total += x.reduce((a, c) => a += (!(Number(c.return_qty) * Number(c.return_amt)) ? 0 : (Number(c.return_qty) * Number(c.return_amt))), 0);
      this.formGroup.patchValue({
        total: total
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

  clearsearch() {
    this.search_receive_no = null;

    //this.search_receive();
    //this.search_available_return();
  }

  search_receive() {

    this.searchloading = this.searchLoadingEnt.noRecord;

    for (let index = 0; index < this.SearchList.value.length; index++) {
      this.SearchList.at(index).get('IS_CHECKED').patchValue(false);
    }

    //this.clearsearch();

    this.s_service.receive_list().subscribe(x => {
      this.AC_Receive = x;
    });
    //this.search_available_return();
  }

  search_receive_date: Date = null;
  search_receive_no: string = null;
  change_receive_no(select: ReceiveList[]) {
    select.forEach(item => {
      if (item.receive_no == this.search_receive_no) {
        this.search_receive_date = item.receive_date;
      }
    });

    this.search_available_return();
  }

  search_available_return() {
    var receive_no = this.search_receive_no;

    //this.searchloading = this.searchLoadingEnt.noRecord
    this.s_service.available_return(receive_no)
      .pipe(tap(() => this.searchloading = this.searchLoadingEnt.loading))
      .subscribe(x => {
        while (this.SearchList.length) {
          this.SearchList.removeAt(0);
        }

        if (!x.length) {
          this.searchloading = this.searchLoadingEnt.noRecord;
          return;
        } else {

          x.forEach(item => {

            const searchfb = this.searchfb.group({
              IS_CHECKED: new FormControl({ value: false, disabled: false }),
              item_id: new FormControl({ value: item.item_id, disabled: false }),
              log_id: new FormControl({ value: item.log_id, disabled: false }),
              receive_no: new FormControl({ value: item.receive_no, disabled: false }),
              tax_invoice_no: new FormControl({ value: item.tax_invoice_no, disabled: false }),
              return_qty: new FormControl({ value: item.return_qty, disabled: false }),
              return_amt: new FormControl({ value: item.return_amt, disabled: false }),
              product_code: new FormControl({ value: item.product_code, disabled: false }),
              product_name: new FormControl({ value: item.product_name, disabled: false }),

              stock_qty: new FormControl({ value: item.stock_qty, disabled: false }),
              stock_amt: new FormControl({ value: item.stock_amt, disabled: false }),
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


  confirmSelect() {
    let f = this.formGroup.getRawValue();
    if (this.search_receive_no != f.receive_no) {
      while (this.DetailList.length) {
        this.DetailList.removeAt(0);
      }
    }

    const x = this.getIsSelect;

    x.forEach(item => {

      var chk = this.DetailList.value.filter(x => x.item_id == item.item_id && x.log_id == item.log_id);
      if (chk.length > 0) {
        //Duplicate select
      } else {

        const fg = this.fb.group({
          item_id: new FormControl({ value: item.item_id, disabled: false }),
          log_id: new FormControl({ value: item.log_id, disabled: false }),
          receive_no: new FormControl({ value: item.receive_no, disabled: false }),
          tax_invoice_no: new FormControl({ value: item.tax_invoice_no, disabled: false }),
          return_qty: new FormControl({ value: item.return_qty, disabled: false }),
          return_amt: new FormControl({ value: item.return_amt, disabled: false }),
          product_code: new FormControl({ value: item.product_code, disabled: false }),
          product_name: new FormControl({ value: item.product_name, disabled: false }),
          stock_qty: new FormControl({ value: item.stock_qty, disabled: false }),
          stock_amt: new FormControl({ value: item.stock_amt, disabled: false }),
        });

        this.DetailList.push(fg);
      }
    });
    this.formGroup.patchValue({
      receive_no: this.search_receive_no,
      receive_date: setZeroHours(this.search_receive_date),
    });
    this.detailreInitDatatable();
  }


  detaildelete(index: number) {
    this.DetailList.removeAt(index);
    this.detailreInitDatatable();
  }


  // load_wh() {
  //   this.search_whl_id = null;
  //   this.s_service.get_wh(Number(this.search_branch_id)).subscribe(x => {
  //     this.AC_Warehouse = x;
  //   });
  // }

  // list_wh = [];
  // load_wh_line(index: number) {

  //   this.DetailList.controls[index].patchValue({
  //     whl_id: null, //new FormControl({ value: null, disabled: false }, Validators.required),
  //   });

  //   //this.DetailList.controls[index] = null;
  //   this.reload_wh();
  //   console.log(this.list_wh);
  //   console.log(this.DetailList.controls[index]);
  // }

  // reload_wh() {
  //   this.list_wh = [];
  //   this.DetailList.value.forEach(d => {
  //     this.s_service.get_wh(Number(d.branch_id)).subscribe(x => {
  //       var AC: AutoCompleteModel[] = x;
  //       this.list_wh.push(AC);
  //     });
  //   });
  // }


  onSubmit() {
    this.s_loader.showLoader()
    let f = this.formGroup.getRawValue();
    f = {
      ...f,
      return_date: setZeroHours(f.return_date)
    }
    this.s_service.create_return(f)
      .pipe(finalize(() => this.s_loader.onEnd()))
      .subscribe(() => {
        toastr.success(message.created);
        this.route.navigate(['pss/pss-return-product-list']);
      }, (err) => {
        toastr.error(err.error);
      });
  }


  debug() {
    let f = this.formGroup.getRawValue();
    f = {
      ...f,
      return_date: setZeroHours(f.return_date)
    }
    console.log(f);
  }

}

