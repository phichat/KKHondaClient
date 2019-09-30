import { OnInit, Component, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormControlName, Validators } from '@angular/forms';
import { ListItemConfig } from './list-item.config';
import { getDateMyDatepicker, setZeroHours, appConfig } from 'app/app.config';
import { mergeMap, merge, map } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { RisLocalStoreage as LS, UserForRis as EURIS, ExpensesType as EXPT } from 'app/entities/ris.entities';
import { DropDownModel } from 'app/models/drop-down-model';
import { UserService } from 'app/services/users';

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
    private fb: FormBuilder,
    private s_user: UserService
  ) {
    super();
    this.destroy();
    this.mUser = this.s_user.cookies;
    this.disableNotEqualSale = this.mUser.gId != EURIS.Sale;
    this.disableNotEqualRis = this.mUser.gId != EURIS.Regist;
  }

  toggleExpenses = true;
  toggleTag = true;

  ngOnInit(): void {
    const status = combineLatest(this.Status1, this.Status2).pipe(
      map((val) => {
        return { status1: val[0], status2: val[1] }
      })
    );

    status.subscribe(x => {
      this.chRef.markForCheck;
      this.disableNotEqualReceive = x.status1 != this.ConStatus1.Received && x.status1 != null;
      this.disableIsEqualSend1 = x.status2 != null;
      this.disableIsEqualSend2 = x.status2 != this.ConStatus2.Send1;
    })

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
    });

    this.formExpenses = this.fb.group({
      expitemCode: new FormControl(null),
      expItem: new FormControl(null),
      expPrice1: new FormControl(null),
      expVatPrice1: new FormControl(null),
      expNetPrice1: new FormControl({ value: null, disabled: this.disableNotEqualSale ? true : false }),
      expIsVat: new FormControl({ value: false, disabled: this.disableNotEqualSale ? true : false }),
      expPrice2: new FormControl({ value: null, disabled: this.disableNotEqualRis ? true : false }),
      expPrice3: new FormControl({ value: null, disabled: this.disableNotEqualRis ? true : false }),
      // otItem: new FormControl(null),
      // otPrice1: new FormControl(null),
      // otPrice2: new FormControl(null),
      // otVatPrice1: new FormControl(null),
      // otIsVat: new FormControl(false)
    })

    const mProvince = `${appConfig.apiUrl}/Master/MProvince/DropDown`;
    const mInsure = `${appConfig.apiUrl}/Master/CompanyInsurance/DropDown`;
    const observe = combineLatest(
      this.http.get<DropDownModel[]>(mProvince),
      this.http.get<DropDownModel[]>(mInsure)
    ).pipe(
      map(x => {
        return { mProvince: x[0], mInsure: x[1] }
      })
    )

    observe.subscribe(x => {
      this.provinceDropdown = x.mProvince;
      this.insureDropdown = x.mInsure;
    })

    if (this.Mode != this.ActionMode.Detail) {
      this.formExpenses.get('expNetPrice1')
        .valueChanges
        .subscribe(() => {
          this.onExpensesCalVat();
        });

      // this.formExpenses.get('otPrice1')
      //   .valueChanges
      //   .subscribe(() => {
      //     this.onOtherCalVat();
      //   });

      const apiURL = `${this.risUrl}/ExpensesOther`;
      this.http.get(apiURL)
        .subscribe((x: any[]) => {
          if (!x.length) {
            this.loading = 1;
            return;
          };
          this.chRef.markForCheck();

          if (this.mUser.gId == EURIS.Sale) {
            this.expenses = x.filter(o => o.expensesType != EXPT.InternalCost);
          } else {
            this.expenses = x;
          }

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

      this.CarRegisListItem.valueChanges.subscribe(() => this.emitValue(this.CarRegisListItem.getRawValue()));

      this.formCarHistory.valueChanges.subscribe(() => this.emitValueTagHistory(this.formCarHistory.getRawValue()));
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
    const checkMode = this.Mode == this.ActionMode.Detail;
    list.forEach(item => {
      const fg = this.fb.group({
        runId: item.runId,
        bookingId: item.bookingId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        itemPrice1: item.itemPrice1,
        itemNetPrice1: new FormControl({
          value: item.itemNetPrice1,
          disabled: (checkMode || this.disabledItemNetPrice1) ? true : false
        }),
        itemIsVat: new FormControl({
          value: item.itemVatPrice1 > 0 && true,
          disabled: (checkMode || this.disabledItemVatPrice1) ? true : false
        }),
        itemPrice2: new FormControl({
          value: item.itemPrice2,
          disabled: (checkMode || this.disabledItemPrice2) ? true : false
        }),
        itemPrice3: new FormControl({
          value: item.itemPrice3,
          disabled: (checkMode || this.disableItemPrice3) ? true : false
        }),
        itemVatPrice1: item.itemVatPrice1,
        itemPriceTotal: item.itemNetPrice1 + item.itemPrice2 + item.itemPrice3
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
      itemVatPrice1: 0,
      itemNetPrice1: new FormControl({
        value: 0, disabled: this.disableNotEqualSale ? true : false
      }),
      itemIsVat: new FormControl({
        value: false, disabled: this.disableNotEqualSale ? true : false
      }),
      itemPrice2: new FormControl({
        value: 0, disabled: this.disabledItemPrice2
      }),
      itemPrice3: new FormControl({
        value: 0, disabled: this.disableItemPrice3
      }),
      itemCutBalance: item.itemCutBalance,
      itemPriceTotal: item.expensesAmount
    });
    this.CarRegisListItem.push(fg);
  }

  onAddExpItem() {
    const exp = this.formExpenses.getRawValue();
    const fg = this.fb.group({
      runId: 0,
      itemCode: exp.expitemCode,
      itemName: exp.expItem,
      itemPrice1: exp.expPrice1,
      itemVatPrice1: exp.expVatPrice1,
      itemNetPrice1: new FormControl({
        value: exp.expNetPrice1,
        disabled: this.disableNotEqualSale ? true : false
      }),
      itemIsVat: new FormControl({
        value: exp.expIsVat,
        disabled: this.disableNotEqualSale
      }),
      itemPrice2: new FormControl({
        value: exp.expPrice2,
        disabled: this.disabledItemPrice2
      }),
      itemPrice3: new FormControl({
        value: exp.expPrice3,
        disabled: this.disableItemPrice3
      }),
      itemPriceTotal: exp.expNetPrice1 + exp.expPrice2 + exp.expPrice3
    })
    this.CarRegisListItem.push(fg);
    this.formExpenses.patchValue({
      expitemCode: null,
      expItem: null,
      expPrice1: null,
      expVatPrice1: null,
      expNetPrice1: null,
      expPrice2: null,
      expPrice3: null,
      expIsVat: false
    });
  }

  get disabledItemNetPrice1(): boolean {
    return (this.disableNotEqualSale || this.disableNotEqualReceive) ? true : false;
  }

  get disabledItemVatPrice1(): boolean {
    return this.disabledItemNetPrice1;
  }

  get disabledItemPrice2(): boolean {
    return (this.disableNotEqualRis || this.disableIsEqualSend1) ? true : false;
  }

  get disableItemPrice3(): boolean {
    return (this.disableNotEqualRis || this.disableIsEqualSend2) ? true : false
  }

  onSelectExpenses(item: any) {
    if (!item) {
      this.formExpenses.reset();
      return;
    }
    const isInternalCost = item.expensesType == EXPT.InternalCost;
    this.formExpenses.patchValue({
      expitemCode: item ? item.expensesCode : null,
      expPrice1: item ? (isInternalCost ? null : item.expensesAmount) : null,
      expNetPrice1: item ? (isInternalCost ? null : item.expensesAmount) : null,
      expPrice2: item ? (isInternalCost ? item.expensesAmount : null) : null,
    });
  }

  onExpensesCalVat() {
    const expPrice1 = (this.formExpenses.get('expIsVat').value && this.formExpenses.get('expNetPrice1').value)
      ? this.formExpenses.get('expNetPrice1').value / 1.07
      : this.formExpenses.get('expNetPrice1').value;

    const expVatPrice1 = this.formExpenses.get('expNetPrice1').value - expPrice1;
    this.formExpenses.patchValue({
      expPrice1,
      expVatPrice1
    });
  }

  onItemCalVat(index) {
    let list = this.CarRegisListItem.at(index);
    const itemPrice1 = list.get('itemIsVat').value && list.get('itemNetPrice1').value
      ? list.get('itemNetPrice1').value / 1.07
      : list.get('itemNetPrice1').value;

    const itemVatPrice1 = list.get('itemNetPrice1').value - itemPrice1;
    list.patchValue({
      itemPrice1,
      itemVatPrice1
    });
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
      [...a, { ...c, itemCutBalance: c.itemNetPrice1 }],
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
      tagRegis: tagRegis ? setZeroHours(tagRegis) : null,
      tagExpire: tagExpire ? setZeroHours(tagExpire) : null,
      prbRegis: prbRegis ? setZeroHours(prbRegis) : null,
      prbExpire: prbExpire ? setZeroHours(prbExpire) : null,
      commitExpire: commitExpire ? setZeroHours(commitExpire) : null,
      warRegis: warRegis ? setZeroHours(warRegis) : null,
      warExpire: warExpire ? setZeroHours(warExpire) : null
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