import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ModelUser } from 'app/models/users';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { DropDownModel } from 'app/models/drop-down-model';
import { appConfig } from 'app/app.config';
import { TagClConfig } from './tag-cl.config';
import { LoaderService } from 'app/core/loader/loader.service';
import { finalize, mergeMap, tap, mapTo } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

declare var toastr: any;
@Component({
  selector: 'app-tag-cl-form-detail',
  templateUrl: './tag-cl-form-detail.component.html'
})
export class TagClFormDetailComponent extends TagClConfig implements OnInit {

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
  checkedAll: boolean;
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
      bankName: new FormControl(null),
      documentRef: new FormControl(null),
      paymentType: new FormControl(null),
      branchId: new FormControl(null),
      createDate: new FormControl(null),
      createBy: new FormControl(null),
      createName: new FormControl(null),
      updateDate: new FormControl(null),
      updateBy: new FormControl(null),
      remark: new FormControl(null),
      reason: new FormControl(null),
      status: new FormControl(null),
      statusDesc: new FormControl(null),
      AlList: this.fb.array([])
    });

    const url = `${appConfig.apiUrl}/Reason/DropDown`;
    this.http.get(url).subscribe((x: DropDownModel[]) => this.reasonDropdown = x);

    this.loadingAlList();

    this.s_user.currentData.subscribe(x => {
      if (!x) return;
      this.chRef.markForCheck();
      this.formGroup.patchValue({ updateBy: x.id });
      this.chRef.detectChanges();
    });
  }

  loadingAlList() {
    this.activeRoute.params.subscribe(x => {
      const GetByClNo = `${appConfig.apiUrl}/Ris/Cl/GetByClNo`;
      const GetByAlNo = `${appConfig.apiUrl}/Ris/Al/GetByAlNo`;
      const params = { clNo: x['code'] }
      this.http.get(GetByClNo, { params })
        .pipe(
          mergeMap((al) => {
            const getConNo = (p: any) => this.http.get(GetByAlNo, { params: { alNo: al['alNo'] } })
              .pipe(
                tap(al => p['AlList'] = [al]),
                mapTo(p)
              );
            return getConNo(al);
          })
        ).subscribe((o: any) => {
          this.formGroup.patchValue({
            clNo: o.clNo,
            alNo: o.alNo,
            refundName: o.refundName,
            balancePrice: o.balancePrice,
            receivePrice: o.receivePrice,
            netPrice: o.netPrice,
            bankName: o.bankName,
            documentRef: o.documentRef,
            paymentType: o.paymentType.toString(),
            remark: o.remark,
            reason: o.reason,
            status: o.status,
            statusDesc: o.statusDesc,
            createDate: o.createDate,
            createName: o.createName
          })
          if (!o['AlList'].length) { this.loading = 1; return }
          const res = o['AlList'].reduce((a, c) => [...a, { ...c, IS_CHECKED: true }], []);
          this.setItemFormArray(res, this.formGroup, 'AlList');
          this.chRef.markForCheck();

          this.reInitDatatable();
        }, () => this.loading = 2);
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
    if (!confirm('ยืนยันการยกเลิกการคืนเงิน หรือไม่?')) return;
    let f = { ...this.formGroup.value };
    f = {
      clNo: f.clNo,
      reason: f.reason,
      updateBy: f.updateBy,
      remark: f.remark
    }

    this.s_loader.showLoader();
    const url = `${appConfig.apiUrl}/Ris/Cl/Cancel`;
    this.http.post(url, f).pipe(
      finalize(() => this.s_loader.onEnd())
    ).subscribe(() => {
      toastr.success(message.created);
      this.router.navigate(['ris/cl-list']);
    }, () => toastr.error(message.failed));

  }

  printCl() {
    const url = `${appConfig.reportUrl}/RIS/index.aspx?clNo=${this.formGroup.get('clNo').value}&userId=${this.formGroup.get('updateBy').value}&formCl=true`;
    window.open(url, '_blank');
  }
}
