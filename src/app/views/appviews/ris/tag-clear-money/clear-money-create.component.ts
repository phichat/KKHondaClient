import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { appConfig } from 'app/app.config';
import { LoaderService } from 'app/core/loader/loader.service';
import { finalize, tap, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { ClearMoneyConfig } from './clear-money.config';
import { of } from 'rxjs';
declare var toastr: any;

@Component({
  selector: 'app-clear-money-create',
  templateUrl: './clear-money-create.component.html'
})
export class ClearMoneyCreateComponent extends ClearMoneyConfig implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    // this.destroyDatatable();
  }

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

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      createBy: new FormControl(null),
      createDate: new FormControl(new Date()),
      sedCreateBy: new FormControl(null),
      sedCreateName: new FormControl(null),
      sedNo: new FormControl(null),
      remark: new FormControl(null)
    });

    this.searchSed();

    this.s_user.currentData.subscribe(x => {
      if (!x) return;
      this.chRef.markForCheck();
      this.mUser = x;
      this.chRef.detectChanges();
    });
  }

  onSubmit() {

  }

  selectItemSed(e: any) {
    this.formGroup.patchValue({
      sedCreateBy: e.createBy,
      sedCreateName: e.createName,
      sedNo: e.sedNo
    });

    this.$ConListNo.next(e.conList);
    this.$SedNo.next(e.sedNo);
  }


  searchSed() {
    this.searchTypeahead.pipe(
      tap(() => {
        this.searchSedLoading = true;
        this.searchSedLoadingTxt = 'รอสักครู่...'
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term =>
        term
          ? this.http.get<any[]>(`${this.risUrl}/Sed/GetByTermSedNo`, { params: { term } })
          : of([])
      )
    ).subscribe(x => {
      this.chRef.markForCheck();
      this.searchSedLoading = false;
      this.searchSedLoadingTxt = '';
      this.sedDropDown = x;
      this.sedDropDown.map(item => {
        item.text = item.sedNo;
        item.value = item.sedNo;
      })
    }, () => {
      this.searchSedLoading = false;
      this.searchSedLoadingTxt = '';
      this.sedDropDown = [];
    });
  }
}