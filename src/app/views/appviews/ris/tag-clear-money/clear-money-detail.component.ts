import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { appConfig } from 'app/app.config';
import { LoaderService } from 'app/core/loader/loader.service';
import { finalize, tap, mergeMap, map } from 'rxjs/operators';
import { ClearMoneyConfig } from './clear-money.config';
import { IRevListRes, ISedRes, IRevWithSedItem } from 'app/interfaces/ris';
import { ActivatedRoute, Router } from '@angular/router';
import { of, combineLatest } from 'rxjs';
import { DropDownModel } from 'app/models/drop-down-model';
declare var toastr: any;

@Component({
  selector: 'app-clear-money-detail',
  templateUrl: './clear-money-detail.component.html'
})
export class ClearMoneyDetailComponent extends ClearMoneyConfig implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    // this.destroyDatatable();
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
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

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      createBy: new FormControl(null),
      createName: new FormControl(null),
      createDate: new FormControl(null),
      updateBy: new FormControl(null),
      updateName: new FormControl(null),
      updateDate: new FormControl(null),
      sedCreateBy: new FormControl(null),
      sedCreateName: new FormControl(null),
      revId: new FormControl(null),
      revNo: new FormControl(null),
      sedNo: new FormControl(null),
      remark: new FormControl(null),
      branchId: new FormControl(null),
      totalPrice1: new FormControl(null),
      totalVatPrice1: new FormControl(null),
      totalNetPrice: new FormControl(null),
      totalCutBalance: new FormControl(null),
      totalPrice2: new FormControl(null),
      totalIncome: new FormControl(null),
      totalClBalancePrice: new FormControl(null),
      totalClReceivePrice: new FormControl(null),
      totalExpenses: new FormControl(null),
      totalAccruedExpense: new FormControl(null),
      status: new FormControl(0),
      reason: new FormControl(null, Validators.required)
    });


    const url = `${appConfig.apiUrl}/Reason/DropDown`;
    this.http.get(url).subscribe((x: DropDownModel[]) => this.reasonDropdown = x);

    this.activeRoute.params.pipe(
      mergeMap((x) => {
        return combineLatest(of(x), this.s_user.currentData).pipe(
          map(o => {
            return {
              params: o[0],
              curretUser: o[1]
            };
          })
        );
      })
    ).subscribe(p => {
      this.chRef.markForCheck();
      if (p.curretUser == null) return;
      this.code = p.params.code;
      const params = { revNo: p.params.code };
      this.http.get(`${this.risUrl}/Rev/GetByRevNo`, { params }).pipe(
        tap(() => this.s_loader.showLoader()),
        mergeMap((rev: IRevListRes) => {
          const params = { sedNo: rev.sedNo };
          const url = `${this.risUrl}/Sed/GetBySedNo`;
          return this.http.get(url, { params }).pipe(
            map((sed: ISedRes) => {
              return {
                revItem: rev,
                sedItem: sed
              }
            })
          )
        }),
        finalize(() => this.s_loader.onEnd())
      ).subscribe((o: IRevWithSedItem) => {
        o.revItem.updateBy = p.curretUser.id;
        // o.revItem.updateDate = new Date();
        o.revItem.sedCreateName = o.sedItem.createName
        this.formGroup.patchValue({ ...o.revItem });
        this.$SedItem.next(o.sedItem);
      });
    });


  }

  onSubmit() {
    if (!confirm('ยืนยันการยกเลิก "บันทึกรับคืนเรื่อง" หรือไม่?'))
      return;

    const url = `${this.risUrl}/REV/Cancel`;
    const f = { ...this.formGroup.value };
    this.http.post(url, f).pipe(
      finalize(() => this.s_loader.onEnd())
    ).subscribe(() => {
      toastr.success(message.canceled);
      this.router.navigate(['ris/clear-money-list']);
    }, () => toastr.error(message.failed));

  }
}