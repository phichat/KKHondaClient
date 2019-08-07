import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { appConfig } from 'app/app.config';
import { TagAlConfig } from './tag-al.config';
import { LoaderService } from 'app/core/loader/loader.service';
import { finalize, mergeMap, tap, mapTo } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DropDownModel } from 'app/models/drop-down-model';
declare var toastr: any;

@Component({
  selector: 'app-tag-al-form-detail',
  templateUrl: './tag-al-form-detail.component.html'
})
export class TagAlFormDetailComponent extends TagAlConfig implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private s_user: UserService,
    private chRef: ChangeDetectorRef,
    private s_loader: LoaderService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      alNo: new FormControl(null),
      sedNo: new FormControl(null),
      borrowerId: new FormControl(null),
      borrowerName: new FormControl(null),
      sendingPrice: new FormControl(null),
      remainPrice: new FormControl(null),
      price2Remain: new FormControl(null),
      paymentPrice: new FormControl(null),
      price2: new FormControl(null),
      bankCode: new FormControl(null),
      bankName: new FormControl(null),
      documentRef: new FormControl(null),
      paymentType: new FormControl(null),
      branchId: new FormControl(null),
      createDate: new FormControl(null),
      createBy: new FormControl(null),
      createName: new FormControl(null),
      updateBy: new FormControl(null),
      remark: new FormControl(null),
      reason: new FormControl(null),
      status: new FormControl(null),
      statusDesc: new FormControl(null),
      SedList: this.fb.array([])
    });

    const url = `${appConfig.apiUrl}/Reason/DropDown`;
    this.http.get(url).subscribe((x: DropDownModel[]) => this.reasonDropdown = x);

    this.loadingSedList();

    this.s_user.currentData.subscribe(x => {
      if (!x) return;
      this.chRef.markForCheck();
      this.formGroup.patchValue({
        updateBy: x.id
      });
      this.chRef.detectChanges();
    });
  }

  loadingSedList() {
    this.activeRoute.params.subscribe(x => {
      const GetByAlNo = `${appConfig.apiUrl}/Ris/Al/GetByAlNo`;
      const GetBySedNo = `${appConfig.apiUrl}/Ris/Sed/GetBySedNo`;
      const params = { alNo: x['code'] }
      this.http.get(GetByAlNo, { params })
        .pipe(
          mergeMap((al) => {
            const getConNo = (p: any) => this.http.get(GetBySedNo, { params: { sedNo: al['sedNo'] } })
              .pipe(
                tap(sed => p['SedList'] = [sed]),
                mapTo(p)
              );
            return getConNo(al);
          })
        ).subscribe((x: any) => {

          this.formGroup.patchValue({
            alNo: x.alNo,
            borrowerName: x.borrowerName,
            sendingPrice: x.sendingPrice,
            remainPrice: x.remainPrice,
            price2Remain: x.price2Remain,
            paymentPrice: x.paymentPrice,
            price2: x.price2,
            bankName: x.bankName,
            documentRef: x.documentRef,
            paymentType: x.paymentType.toString(),
            createDate: x.createDate,
            createName: x.createName,
            remark: x.remark,
            status: x.status,
            statusDesc: x.statusDesc,
            reason: x.reason
          })

          if (!x['SedList'].length) {
            this.loading = 1;
            return;
          };
          const res = x['SedList'].reduce((a, c) => [...a, { ...c, IS_CHECKED: true, conList: "" }], []);
          this.setItemFormArray(res, this.formGroup, 'SedList');
          this.chRef.markForCheck();

          this.reInitDatatable();
        }, () => {
          this.loading = 2;
        });
    })

  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }

  onSubmit() {
    if (!confirm('ยืนยันการยกเลิกส่งการยืมเงิน หรือไม่?')) return;
    let f = { ...this.formGroup.value };
    f = {
      alNo: f.alNo,
      reason: f.reason,
      remark: f.remark,
      updateBy: f.updateBy
    }

    this.s_loader.showLoader();
    const url = `${appConfig.apiUrl}/Ris/Al/Cancel`;
    this.http.post(url, f).pipe(
      finalize(() => this.s_loader.onEnd())
    ).subscribe(() => {
      toastr.success(message.created);
      this.router.navigate(['ris/al-list']);
    }, () => toastr.error(message.failed));
  }
}
