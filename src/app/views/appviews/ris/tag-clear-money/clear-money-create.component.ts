import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/services/users';
import { LoaderService } from 'app/core/loader/loader.service';
import { tap, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { ClearMoneyConfig } from './clear-money.config';
import { of } from 'rxjs';
import { ISedRes, IConItemOutput, IConRes, IAlRes } from 'app/interfaces/ris';
import { ClearMoneyService } from './clear-money.service';
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
    private s_loader: LoaderService,
    private s_cloarMoney: ClearMoneyService
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
      remark: new FormControl(null),
      totalCutBalance: new FormControl(null),
      totalPrice2: new FormControl(null),
      totalIncom: new FormControl(null),
      alBalancePrice: new FormControl(null),
      alPaymentPrice: new FormControl(null),
      expenses: new FormControl(null)
    });

    this.searchSed();

    this.s_user.currentData.subscribe(x => {
      if (!x) return;
      this.chRef.markForCheck();
      this.mUser = x;
      this.chRef.detectChanges();
    });

    this.formGroup.get('totalCutBalance').valueChanges.subscribe((cutBalance: number) => {
      const balance = this.formGroup.get('alBalancePrice').value as number;
      const expenses = this.calExpenses(balance, cutBalance);
      const totalIncom = this.calIncom(balance, cutBalance);
      this.formGroup.patchValue({
        expenses: expenses.toFixed(2),
        totalIncom: totalIncom.toFixed(2)
      });
    });

    this.formGroup.get('alBalancePrice').valueChanges.subscribe((balance: number) => {
      const cutBalance = this.formGroup.get('totalCutBalance').value as number;
      const totalIncom = this.calIncom(balance, cutBalance);
      this.formGroup.patchValue({
        totalIncom: totalIncom.toFixed(2)
      });
    })

    this.ConResOutput$
      .subscribe((x: IConRes[]) => {
        this.chRef.markForCheck();
        // const balance = this.formGroup.get('alBalancePrice').value as number;
        const cutBalance = x.reduce((a, c) => a += c.cutBalance, 0);
        // const totalIncom = this.calIncom(balance, cutBalance);
        this.formGroup.patchValue({
          totalCutBalance: cutBalance.toFixed(2),
        });
        this.chRef.detectChanges();
      });

    this.AlOutput$.subscribe((x: IAlRes[]) => {
      this.chRef.markForCheck();
      const balance = x.reduce((a, c) => a += c.balancePrice, 0);
      const cutBalance = this.formGroup.get('totalCutBalance').value;
      const expenses = this.calExpenses(balance, cutBalance);
      this.formGroup.patchValue({
        alBalancePrice: balance.toFixed(2),
        expenses: expenses.toFixed(2)
      });
      this.chRef.detectChanges();
    })
  }

  calIncom = (balance: number, cutBalance: number) =>
    cutBalance > balance ? cutBalance - balance : 0;

  calExpenses = (balance: number, cutBalance: number) =>
    balance > cutBalance ? balance - cutBalance : 0;

  onSubmit() {
    const listCon = this.ConResOutput$.value.filter(x => x.state1 != null);
    let listConItem = [];
    let listItemDoc = [];
    listCon.forEach(x => {
      const conItem = this.s_cloarMoney.ListConItem
        .filter(o => o.state != null && o.bookingNo == x.bookingNo);
      const itemDoc = this.s_cloarMoney.ListConItemDoc
        .filter(o => o.bookingNo == x.bookingNo);
      listConItem = [...listConItem, ...conItem];
      listItemDoc = [...listItemDoc, ...itemDoc];
    });

    console.log(listCon);
    console.log(listConItem);
    console.log(listItemDoc);
  }

  selectItemSed(e: ISedRes) {
    this.$SedItem.next(e);
    if (!e) return;
    this.formGroup.patchValue({
      sedCreateBy: e.createBy,
      sedCreateName: e.createName,
      sedNo: e.sedNo
    });

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
          ? this.http.get<ISedRes[]>(`${this.risUrl}/Sed/GetByTermSedNo`, { params: { term } })
          : of([])
      )
    ).subscribe((x: ISedRes[]) => {
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

  ConItem_Output(event: IConItemOutput) {
    this.$ConItemOutput.next(event);
  }
}