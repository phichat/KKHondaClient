import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ModelUser } from 'app/models/users';
import { FormArray, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { DropDownModel } from 'app/models/drop-down-model';
import { appConfig } from 'app/app.config';
import { TagClConfig } from './tag-cl.config';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';
import { LoaderService } from 'app/core/loader/loader.service';
import { finalize } from 'rxjs/operators';

declare var toastr: any;
@Component({
  selector: 'app-tag-cl-form',
  templateUrl: './tag-cl-form.component.html',
  styleUrls: ['./tag-cl-form.component.scss']
})
export class TagClFormComponent extends TagClConfig implements OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private s_user: UserService,
    private chRef: ChangeDetectorRef,
    private s_loader: LoaderService
  ) {
    super();
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
  }
  checkedAll: boolean;
  mUser: ModelUser;
  bankingsDropdown = new Array<DropDownModel>();

  @ViewChild("receivePrice") inputReceivePrice: ElementRef;

  ngOnInit() {
    this.formGroup = this.fb.group({
      clNo: new FormControl(null),
      alNo: new FormControl(null),
      revNo: new FormControl(null),
      refundId: new FormControl(null),
      refundName: new FormControl(null),
      balancePrice: new FormControl(null),
      receivePrice: new FormControl(null),
      netPrice: new FormControl(null),
      bankCode: new FormControl(null),
      documentRef: new FormControl(null),
      paymentType: new FormControl(null),
      branchId: new FormControl(null),
      createDate: new FormControl(null),
      createBy: new FormControl(null),
      remark: new FormControl(null),
      AlList: this.fb.array([])
    });

    const bank = `${appConfig.apiUrl}/Bank/DropDown`;
    this.http.get(bank).subscribe((x: any[]) => {
      this.chRef.markForCheck();
      this.bankingsDropdown = x;
      this.chRef.detectChanges();
    });

    this.loadingAlList();

    this.s_user.currentData.subscribe(x => {
      if (!x) return;
      this.chRef.markForCheck();
      this.mUser = x;
      this.chRef.detectChanges();
    });
  }

  loadingAlList() {
    const carList = `${appConfig.apiUrl}/Ris/Al/NormalList`;
    this.http.get(carList).subscribe((x: any[]) => {
      if (!x.length) { this.loading = 1; return }
      const res = x.reduce((a, c) => [...a, { ...c, IS_CHECKED: false }], []);
      this.setItemFormArray(res, this.formGroup, 'AlList');
      this.chRef.markForCheck();

      this.AlList.valueChanges.subscribe((x: any[]) => {
        const rec = x.find(o => o.IS_CHECKED);
        this.balancePriceState = rec ? rec.balancePrice : null;
        this.formGroup.patchValue({
          alNo: rec ? rec.alNo : null,
          refundId: rec ? rec.createBy : null,
          refundName: rec ? rec.createName : null,
          balancePrice: this.balancePriceState,
          receivePrice: this.balancePriceState,
          netPrice: rec ? rec.netPrice : null,
          createDate: new Date(),
          createBy: this.mUser.id,
          branchId: this.mUser.branch,
          paymentType: '1'
        });
        this.onChangeReceivePrice(this.balancePriceState);
      });

      this.reInitDatatable();
    }, () => this.loading = 2);
  }

  checkingRecord(i: number) {
    for (let index = 0; index < this.AlList.length; index++) {
      if (index == i) {
        const val = this.AlList.at(index).get('IS_CHECKED').value;
        this.AlList.at(index).get('IS_CHECKED').patchValue(!val);
        if (!val == true) this.inputReceivePrice.nativeElement.focus();
      } else {
        this.AlList.at(index).get('IS_CHECKED').patchValue(false);
      }
    }
  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }

  onChangeReceivePrice(value: number) {
    let price = this.balancePriceState - value;
    this.formGroup.get('balancePrice').patchValue(price);
  }

  onSubmit() {
    let f = { ...this.formGroup.value };
    f = {
      clNo: f.clNo,
      alNo: f.alNo,
      refundId: f.refundId,
      refundName: f.refundName,
      balancePrice: f.balancePrice,
      receivePrice: f.receivePrice,
      netPrice: f.netPrice,
      bankCode: f.bankCode,
      documentRef: f.documentRef,
      paymentType: f.paymentType,
      branchId: f.branchId,
      createDate: (f.createDate as Date).toISOString(),
      createBy: f.createBy,
      remark: f.remark,
    }

    this.s_loader.showLoader();
    const url = `${appConfig.apiUrl}/Ris/Cl`;
    this.http.post(url, f).pipe(
      finalize(() => this.s_loader.onEnd())
    ).subscribe(() => {
      toastr.success(message.created);
      this.formGroup.reset();
      this.loadingAlList();
    }, () => toastr.error(message.failed));

  }

  private initDatatable(): void {
    let table: any = $('table');
    this.dataTable = table.DataTable({
      "scrollX": true,
      "columns": [
        null,
        { "orderable": false },
        null,
        null,
        null,
        null,
        null
      ]
    });
  }

  private reInitDatatable(): void {
    this.destroyDatatable()
    setTimeout(() => this.initDatatable(), 0)
  }

  private destroyDatatable() {
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }
  }

}
