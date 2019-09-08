import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/services/users';
import { LoaderService } from 'app/core/loader/loader.service';
import { tap, distinctUntilChanged, debounceTime, switchMap, finalize, mergeMap, map, delay } from 'rxjs/operators';
import { ClearMoneyConfig } from './clear-money.config';
import { of, combineLatest, merge } from 'rxjs';
import { ISedRes, IConItemOutput, IConRes, IAlRes, IConItemRes, IConItemDocRes, IRevListRes, IRevWithSedItem } from 'app/interfaces/ris';
import { ClearMoneyService } from './clear-money.service';
import { message } from 'app/app.message';
import { getDateMyDatepicker, setZeroHours } from 'app/app.config';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router,
    private activeRoute: ActivatedRoute,
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
      createName: new FormControl(null),
      createDate: new FormControl(null),
      updateBy: new FormControl(null),
      updateName: new FormControl(null),
      updateDate: new FormControl(null),
      sedCreateBy: new FormControl(null),
      sedCreateName: new FormControl(null),
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
      status: new FormControl(1)
    });

    this.activeRoute.params
      .pipe(
        mergeMap((x) => {
          return combineLatest(of(x), this.s_user.currentData)
            .pipe(
              map(o => {
                return {
                  params: o[0],
                  curretUser: o[1]
                };
              })
            );
        })
      )
      .subscribe(x => {
        this.chRef.markForCheck();
        if (x.curretUser == null) return;
        this.mode = x.params.mode;
        this.code = x.params.code ? x.params.code : null;
        switch (x.params.mode) {
          case this.ActionMode.Create.toString():
            this.searchSed();
            this.formGroup.patchValue({
              createBy: x.curretUser.id,
              createName: x.curretUser.fullName,
              createDate: new Date(),
              branchId: x.curretUser.branch
            })
            break;

          case this.ActionMode.Edit.toString():
            const params = { revNo: this.code };
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
              o.revItem.updateBy = x.curretUser.id;
              o.revItem.updateDate = new Date();
              o.revItem.sedCreateName = o.sedItem.createName
              this.formGroup.patchValue({ ...o.revItem });
              this.$SedItem.next(o.sedItem);
            });
            break;
        }
        this.chRef.detectChanges();
      })

    this.formGroup.get('totalCutBalance').valueChanges.subscribe((cutBalance: string) => {
      const balance = this.formGroup.get('totalClBalancePrice').value;
      const totalExpenses = this.calExpenses(parseFloat(balance), parseFloat(cutBalance));
      const totalIncome = this.calIncom(parseFloat(balance), parseFloat(cutBalance));

      this.formGroup.patchValue({
        totalExpenses: totalExpenses.toFixed(2),
        totalIncome: totalIncome.toFixed(2)
      });
    });

    this.formGroup.get('totalClBalancePrice').valueChanges.subscribe((balance: string) => {
      const cutBalance = this.formGroup.get('totalCutBalance').value;
      const totalIncome = this.calIncom(parseFloat(balance), parseFloat(cutBalance));
      this.formGroup.patchValue({
        totalIncome: totalIncome.toFixed(2)
      });
    })

    this.formGroup.get('totalClReceivePrice').valueChanges.subscribe((receive: string) => {
      // const balance = this.formGroup.get('totalClBalancePrice').value;
      const totalPrice2 = this.formGroup.get('totalPrice2').value;
      let receivePrice = this.clReceivePriceState == parseFloat(receive)
        ? parseFloat(receive)
        : this.clReceivePriceState + (parseFloat(receive) || 0);
      const totalAccruedExpense = parseFloat(totalPrice2) - (receivePrice);
      this.formGroup.patchValue({
        totalAccruedExpense: totalAccruedExpense.toFixed(2)
      })
    });

    this.ConResOutput$
      .subscribe((x: IConRes[]) => {
        this.chRef.markForCheck();
        const cutBalance = x.reduce((a, c) => a += c.cutBalance, 0);
        const price1 = x.reduce((a, c) => a += c.price1, 0);
        const vatPrice1 = x.reduce((a, c) => a += c.vatPrice1, 0);
        const price2 = x.reduce((a, c) => a += c.price2, 0);
        const netPrice = x.reduce((a, c) => a += (c.price1 + c.vatPrice1), 0);
        this.formGroup.patchValue({
          totalPrice1: price1,
          totalVatPrice1: vatPrice1,
          totalNetPrice: netPrice,
          totalCutBalance: cutBalance.toFixed(2),
          totalPrice2: price2.toFixed(2)
        });
        this.chRef.detectChanges();
      });

    this.AlOutput$.subscribe((x: IAlRes[]) => {
      this.chRef.markForCheck();
      const balance = x.reduce((a, c) => a += c.balancePrice, 0);
      const cutBalance = this.formGroup.get('totalCutBalance').value;
      const totalExpenses = this.calExpenses(balance, cutBalance);
      const receive = x.reduce((a, c) => a += c.receivePrice, 0);
      this.clReceivePriceState = receive;
      this.formGroup.patchValue({
        totalClBalancePrice: balance.toFixed(2),
        totalClReceivePrice: receive.toFixed(2),
        totalAccruedExpense: balance.toFixed(2),
        totalExpenses: totalExpenses.toFixed(2)
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
    let listConItem: IConItemRes[] = [];
    let listItemDoc: IConItemDocRes[] = [];
    listCon.forEach(x => {
      const conItem = this.s_cloarMoney.ListConItem
        .filter(o => o.bookingNo == x.bookingNo);
      const itemDoc = this.s_cloarMoney.ListConItemDoc
        .filter(o => o.bookingNo == x.bookingNo);
      listConItem = [...listConItem, ...conItem];
      listItemDoc = [...listItemDoc, ...itemDoc];
    });

    if (this.mode == this.ActionMode.Create) {
      if (!listConItem.length) {
        alert('กรุณาตรวจสอบข้อมูล "รับเรื่องย่อย" และระบุข้อมูลให้ครบถ่วน!');
        return;
      }

      const listConNullItem = listConItem
        .filter(x => x.state == null)
        .map(x => x.bookingNo);
      const conNoUnique = listConNullItem.filter((v, i) => listConNullItem.indexOf(v) === i)
      if (conNoUnique.length) {
        alert(`กรุณา ระบุข้อมูล "รับเรื่องย่อย" ใบรับเรื่องเลขที่ ${conNoUnique.join('\n')}\nให้ครบถ่วน!`);
        return;
      }
    }

    const listNullItemDoc = listItemDoc
      .filter(x => !x.isReceive)
      .map(x => x.bookingNo);
    const conNoUnique = listNullItemDoc.filter((v, i) => listNullItemDoc.indexOf(v) === i);
    if (conNoUnique.length) {
      if (!confirm(`"เอกสาร/สิ่งที่รับคืน" ใบรับเรื่องเลขที่ ${conNoUnique.join('\n')}\nยังระบุข้อมูลการ "รับเอกสาร" ไม่ครบ คุณต้องการบันทึกข้อมูลหรือไม่?`))
        return
    }

    this.s_loader.showLoader();
    const url = `${this.risUrl}/REV`;
    listItemDoc = listItemDoc
      .filter(x => x.isReceive != null)
      .map(x => {
        const obj = { ...x };
        obj.sendDate = setZeroHours(obj.sendDate);
        obj.receiveDate = setZeroHours(obj.receiveDate);
        return obj;
      });
    listConItem = listConItem.map(o => {
      const obj = { ...o };
      obj.dateReceipt = setZeroHours(getDateMyDatepicker(obj.dateReceipt as any));
      return obj;
    })
    const f = {
      tagRev: this.formGroup.value,
      tagConList: listCon,
      tagConListItem: listConItem,
      tagListItemDoc: listItemDoc
    }
    this.http.post(url, f).pipe(
      finalize(() => this.s_loader.onEnd())
    ).subscribe(() => {
      toastr.success(message.created);
      if (this.mode == this.ActionMode.Edit) {
        this.router.navigate(['ris/clear-money-detail', this.code]);
      } else {
        setTimeout(() => {
          location.reload();
        }, 400);
      }
    }, () => toastr.error(message.failed));
    // console.log(listCon);
    // console.log(listConItem);
    // console.log(listItemDoc.filter(x => x.isReceive != null));
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