import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { Router, ActivatedRoute } from '@angular/router';
import { TagSedConfig } from './tag-sed.config';
import { mergeMap, tap, mapTo, finalize } from 'rxjs/operators';
import { LoaderService } from 'app/core/loader/loader.service';
import { message } from 'app/app.message';
import { UserService } from 'app/services/users';
import { DropDownModel } from 'app/models/drop-down-model';
import { ReasonService } from 'app/services/masters';
import { CarRegisService, SedRegisService } from 'app/services/ris';

declare var toastr: any;
@Component({
  selector: 'app-tag-sed-form-detail',
  templateUrl: './tag-sed-form-detail.component.html'
})
export class TagSedFormDetailComponent extends TagSedConfig implements OnInit, AfterViewInit {

  ngOnDestroy(): void {
    this.destroyDatatable();
  }

  constructor(
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private s_user: UserService,
    private s_loader: LoaderService,
    private s_reason: ReasonService,
    private s_carRegis: CarRegisService,
    private s_sedRegis: SedRegisService
  ) {
    super();
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }

    this.s_reason.DropDown().subscribe((x: DropDownModel[]) => this.reasonDropdown = x);
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      createDate: new FormControl(new Date()),
      createBy: new FormControl(null),
      createName: new FormControl(null),
      updateDate: new FormControl(new Date()),
      updateBy: new FormControl(null),
      branchId: new FormControl(null),
      totalPrice: new FormControl(0),
      price1: new FormControl(0),
      vatPrice1: new FormControl(0),
      netPrice1: new FormControl(0),
      price2: new FormControl(0),
      price3: new FormControl(0),
      price2Remain: new FormControl(0),
      borrowMoney: new FormControl(null),
      status: new FormControl(0),
      statusDesc: new FormControl(null),
      conList: this.fb.array([]),
      sedNo: new FormControl(null),
      reason: new FormControl(null, Validators.required),
      remark: new FormControl(null)
    });
  }

  ngAfterViewInit(): void {
    this.activeRoute.params.subscribe(x => {
      this.s_sedRegis.GetBySedNo(x['code'])
        .pipe(
          mergeMap((sed: any) => {
            const conListNo = sed.conList.split(",");
            const getConNo = (p: any) =>
              this.s_carRegis.GetByConNoListReceiveTag(conListNo)
                .pipe(
                  tap(list => p['conNoList'] = list),
                  mapTo(p)
                );
            return getConNo(sed);
          })
        ).subscribe((x: any) => {
          this.formGroup.patchValue({
            createDate: x.createDate,
            createBy: x.createBy,
            createName: x.createName,
            branchId: x.branchId,
            totalPrice: x.totalPrice,
            price1: x.price1,
            vatPrice1: x.vatPrice1,
            netPrice1: x.netPrice1,
            price2: x.price2,
            price3: x.price3,
            price2Remain: x.price2Remain,
            borrowMoney: x.borrowMoney,
            status: x.status,
            statusDesc: x.statusDesc,
            sedNo: x.sedNo,
            reason: x.reason,
            remark: x.remark
          })
          const conNoList = x['conNoList'];
          if (conNoList.length == 0) {
            this.loading = 1;
            return;
          }
          const res = conNoList.reduce((a, c) => [...a, { ...c, IS_CHECKED: true }], []);
          this.checkedAll = true;
          this.setItemFormArray(res, this.formGroup, 'conList');
          this.chRef.markForCheck();

          this.reInitDatatable();
        }, () => {
          this.loading = 2;
        });
    });

    this.s_user.currentData.subscribe(x => {
      if (!x) return;
      this.chRef.markForCheck();
      this.mUser = x;
      this.formGroup.patchValue({
        updateBy: x.id
      });
      this.chRef.detectChanges();
    });
  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }

  onSubmit() {
    if (confirm('ยืนยันการยกเลิก "ส่งเรื่องดำเนินการ" หรือไม่?')) {
      let f = {
        sedNo: this.formGroup.get('sedNo').value,
        reason: this.formGroup.get('reason').value
      };
      this.s_loader.showLoader();
      this.s_sedRegis.Cancel(f).pipe(
        finalize(() => this.s_loader.onEnd())
      ).subscribe(() => {
        toastr.success(message.created);
        this.router.navigate(['ris/sed-list']);
      }, () => toastr.error(message.failed)); 
    }
  }

  printSed() {
    const url = `${appConfig.reportUrl}/RIS/index.aspx?sedNo=${this.formGroup.get('sedNo').value}&formSed=true`;
    window.open(url, '_blank');
  }
}
