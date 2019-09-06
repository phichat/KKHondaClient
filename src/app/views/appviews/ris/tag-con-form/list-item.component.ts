import { OnInit, Component, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormControlName, Validators } from '@angular/forms';
import { ListItemConfig } from './list-item.config';
import { getDateMyDatepicker } from 'app/app.config';
import { mergeMap, merge, map } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { RisLocalStoreage as LS } from 'app/entities/ris.entities';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./tag-con-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListItemComponent extends ListItemConfig implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.destroy();
  }

  private destroy() {
    // this.destroy$.next();
    // this.destroy$.complete();
    localStorage.removeItem(LS.TrashCarRegisListItem);
  }

  constructor(
    private http: HttpClient,
    private chRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    super();
    this.destroy();
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      carRegisListItem: this.fb.array([])
    });

    this.formCarHistory = this.fb.group({
      carId: new FormControl(0),
      carNo: new FormControl(null),
      bookingId: new FormControl(null),
      eNo: new FormControl(null),
      fNo: new FormControl(null),
      tagNo: new FormControl(null),
      province: new FormControl(null),
      branchId: new FormControl(null),
      tagRegis: new FormControl({ myDate: null }),
      tagExpire: new FormControl({ myDate: null }),
      prbNo: new FormControl(null),
      prbCompany: new FormControl(null),
      prbRegis: new FormControl({ myDate: null }),
      prbExpire: new FormControl({ myDate: null }),
      commitNo: new FormControl(null),
      commitExpire: new FormControl({ myDate: null }),
      warNo: new FormControl(null),
      warCompany: new FormControl(null),
      warRegis: new FormControl({ myDate: null }),
      warExpire: new FormControl({ myDate: null })
    })

    this.formExpenses = this.fb.group({
      expitemCode: new FormControl(null),
      expItem: new FormControl(null),
      expPrice1: new FormControl(0),
      expPrice2: new FormControl(0),
      expVatPrice1: new FormControl(0),
      expIsVat: new FormControl(false),
      otItem: new FormControl(null),
      otPrice1: new FormControl(0),
      otPrice2: new FormControl(0),
      otVatPrice1: new FormControl(0),
      otIsVat: new FormControl(false)
    })

    if (this.Mode != this.ActionMode.Detail) {
      this.formExpenses.get('expPrice1')
        .valueChanges
        .subscribe(() => {
          this.onExpensesCalVat();
        });

      this.formExpenses.get('otPrice1')
        .valueChanges
        .subscribe(() => {
          this.onOtherCalVat();
        });

      const apiURL = `${this.risUrl}/ExpensesOther`;
      this.http.get(apiURL)
        .subscribe((x: any[]) => {
          if (!x.length) {
            this.loading = 1;
            return;
          };
          this.chRef.markForCheck();
          this.expenses = x;
          if (this.Car) {
            this.Car.subscribe(o => {
              if (!o) return;
              if (o.freeTag == 1) {
                const item = this.expenses.find(x => x.expensesCode == 'EXP10001');
                this.addFreeItem(item);
              }
              if (o.freeAct == 1) {
                const item = this.expenses.find(x => x.expensesCode == 'EXP10003');
                this.addFreeItem(item);
              }
              if (o.freeWarranty == 1) {
                const item = this.expenses.find(x => x.expensesCode == 'EXP10004');
                this.addFreeItem(item);
              }

            });
          }

        }, () => this.loading = 2);

      this.CarRegisListItem
        .valueChanges
        .subscribe((x: any[]) => this.emitValue(x));

      this.formCarHistory
        .valueChanges
        .subscribe(x => this.emitValueTagHistory(x));
    }

    if (this.Mode != this.ActionMode.Create) {
      const listItemUrl = `${this.risUrl}/CarListItem/GetByBookingId`;
      const histotyUrl = `${this.risUrl}/CarHistory/GetByBookingId`
      this.BookingId.pipe(
        mergeMap((x: number) => {
          this.chRef.markForCheck();
          if (x == null) return of();
          const params = { bookingId: x.toString() };
          return combineLatest(
            this.http.get(listItemUrl, { params }),
            this.http.get(histotyUrl, { params })
          ).pipe(
            map(o => { return { listItem: o[0] as any[], history: o[1] } })
          )
        })
      ).subscribe(x => {
        this.addListItemFromApi(x.listItem);
        this.addHistoryFromApi(x.history);
      })
    }
  }

  addListItemFromApi(list: any[]) {
    list.forEach(item => {
      const fg = this.fb.group({
        runId: item.runId,
        bookingId: item.bookingId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        itemPrice1: new FormControl({
          value: item.itemPrice1,
          disabled: this.Mode == this.ActionMode.Detail ? true : false
        }),
        itemPrice2: new FormControl({
          value: item.itemPrice2,
          disabled: this.Mode == this.ActionMode.Detail ? true : false
        }),
        itemIsVat: new FormControl({
          value: item.itemVatPrice1 > 0 && true,
          disabled: this.Mode == this.ActionMode.Detail ? true : false
        }),
        itemVatPrice1: item.itemVatPrice1,
        itemPriceTotal: item.itemPrice1 + item.itemVatPrice1 + item.itemPrice2
      });
      this.CarRegisListItem.push(fg);
    });
    this.chRef.detectChanges();
  }

  addHistoryFromApi(item: any) {
    let his = { ...item };
    his.tagRegis = this.setDateMyDatepicker(his.tagRegis);
    his.tagExpire = this.setDateMyDatepicker(his.tagExpire);
    his.prbRegis = this.setDateMyDatepicker(his.prbRegis);
    his.prbExpire = this.setDateMyDatepicker(his.prbExpire);
    his.commitExpire = this.setDateMyDatepicker(his.commitExpire);
    his.warRegis = this.setDateMyDatepicker(his.warRegis);
    his.warExpire = this.setDateMyDatepicker(his.warExpire);

    this.formCarHistory.patchValue({ ...his });
    this.chRef.detectChanges();
  }

  addFreeItem(item: any) {
    const fg = this.fb.group({
      runId: 0,
      itemCode: item.expensesCode,
      itemName: item.expensesDescription,
      itemPrice1: item.expensesAmount,
      itemPrice2: 0,
      itemIsVat: false,
      itemVatPrice1: 0,
      itemCutBalance: item.itemCutBalance,
      itemPriceTotal: item.expensesAmount
    });
    this.CarRegisListItem.push(fg);
  }

  onAddExpItem() {
    const exp = this.formExpenses.value;
    const fg = this.fb.group({
      runId: 0,
      itemCode: exp.expitemCode,
      itemName: exp.expItem,
      itemPrice1: exp.expPrice1,
      itemPrice2: exp.expPrice2,
      itemIsVat: exp.expIsVat,
      itemVatPrice1: exp.expVatPrice1,
      itemPriceTotal: exp.expPrice1 + exp.expVatPrice1 + exp.expPrice2
    })
    this.CarRegisListItem.push(fg);
    this.formExpenses.patchValue({
      expitemCode: null,
      expItem: null,
      expPrice1: 0,
      expPrice2: 0,
      expIsVat: false,
      expVatPrice1: 0
    })
  }

  onAddOtItem() {
    const exp = this.formExpenses.value;
    const fg = this.fb.group({
      runId: 0,
      itemName: exp.otItem,
      itemPrice1: exp.otPrice1,
      itemIsVat: exp.otIsVat,
      itemVatPrice1: exp.otVatPrice1,
      itemPrice2: exp.otPrice2,
      itemPriceTotal: exp.otPrice1 + exp.otVatPrice1 + exp.otPrice2
    })
    this.CarRegisListItem.push(fg);
    this.formExpenses.patchValue({
      otItem: null,
      otPrice1: 0,
      otPrice2: 0,
      otIsVat: false,
      otVatPrice1: 0
    })
  }

  onSelectExpenses(item: any) {
    this.formExpenses.patchValue({
      expitemCode: item ? item.expensesCode : null,
      expPrice1: item ? item.expensesAmount : null,
      expPrice2: item ? item.expensesAmount : null
    });
  }

  onExpensesCalVat() {
    const expVatPrice1 = (this.formExpenses.get('expIsVat').value && this.formExpenses.get('expPrice1').value)
      ? this.formExpenses.get('expPrice1').value * 0.07
      : 0;
    this.formExpenses.get('expVatPrice1').patchValue(expVatPrice1);
  }

  onOtherCalVat() {
    const otVatPrice1 = (this.formExpenses.get('otIsVat').value && this.formExpenses.get('otPrice1').value)
      ? this.formExpenses.get('otPrice1').value * 0.07
      : 0;
    this.formExpenses.get('otVatPrice1').patchValue(otVatPrice1);
  }

  onItemCalVat(index) {
    let list = this.CarRegisListItem.at(index);
    const vat = list.get('itemIsVat').value && list.get('itemPrice1').value
      ? list.get('itemPrice1').value * 0.07
      : 0;
    list.get('itemVatPrice1').patchValue(vat);
  }

  onRemoveListItem(index: number) {
    const item = this.CarRegisListItem.at(index);
    if (!confirm(`ยืนยันการลบรายการ "${item.get('itemName').value}" หรือไม่?`)) return;

    if (this.Mode == this.ActionMode.Edit) {
      let rmItem = (JSON.parse(localStorage.getItem(LS.TrashCarRegisListItem)) || []) as any[];
      rmItem = [...rmItem, item.value];
      localStorage.setItem(LS.TrashCarRegisListItem, JSON.stringify(rmItem));
    }

    this.CarRegisListItem.removeAt(index);
  }

  emitValue(value: any[]) {
    const obj = [...value].reduce((a, c) =>
      [...a, { ...c, itemCutBalance: c.itemPrice1 + c.itemVatPrice1 }],
      []);
    this._IsTagItem = obj.filter(x => x.itemCode == 'EXP10001' || 'EXP10002').length ? false : true;
    this._IsActItem = obj.filter(x => x.itemCode == 'EXP10003').length ? false : true;
    this._IsWarItem = obj.filter(x => x.itemCode == 'EXP10004').length ? false : true;

    this.TagListItem.emit(obj)
  }

  emitValueTagHistory(value: any) {
    let obj = { ...value };
    const tagRegis = getDateMyDatepicker(obj.tagRegis);
    const tagExpire = getDateMyDatepicker(obj.tagExpire);
    const prbRegis = getDateMyDatepicker(obj.prbRegis);
    const prbExpire = getDateMyDatepicker(obj.prbExpire);
    const commitExpire = getDateMyDatepicker(obj.commitExpire);
    const warRegis = getDateMyDatepicker(obj.warRegis);
    const warExpire = getDateMyDatepicker(obj.warExpire);

    obj = {
      ...obj,
      tagRegis: tagRegis ? tagRegis.toISOString() : null,
      tagExpire: tagExpire ? tagExpire.toISOString() : null,
      prbRegis: prbRegis ? prbRegis.toISOString() : null,
      prbExpire: prbExpire ? prbExpire.toISOString() : null,
      commitExpire: commitExpire ? commitExpire.toISOString() : null,
      warRegis: warRegis ? warRegis.toISOString() : null,
      warExpire: warExpire ? warExpire.toISOString() : null
    }
    this.TagHistory.emit(obj);
  }

  enableFormExpenses(): boolean {
    let res: boolean;
    switch (this.Mode) {
      case this.ActionMode.Detail:
        res = false;
        break;

      default:
        if (this.BookingId) {
          this.BookingId.value
        }
        break;
    }
    return res;
  }

}  