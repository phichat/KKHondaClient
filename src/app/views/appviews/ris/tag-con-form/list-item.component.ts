import { OnInit, Component, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms';
import { ListItemConfig } from './list-item.config';
import { getDateMyDatepicker, setZeroHours, appConfig } from 'app/app.config';
import { mergeMap, map } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { RisLocalStoreage as LS, UserForRis as EURIS, ExpensesType as EXPT, ExpensesTag as EXPTag } from 'app/entities/ris.entities';
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


    this.formGroup = this.fb.group({
      CarRegisListItem: this.fb.array([])
    });

    this.ExpenseTagList.forEach(item => {
      this.formGroup = this.fb.group({
        ...this.formGroup.controls,
        [item]: this.fb.array([])
      })
    })

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
  }

  @ViewChild("EXP10001") checkBoxEXP10001: ElementRef;
  @ViewChild("EXP10002") checkBoxEXP10002: ElementRef;
  @ViewChild("EXP10003") checkBoxEXP10003: ElementRef;
  @ViewChild("EXP10004") checkBoxEXP10004: ElementRef;

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
      // this.formExpenses.get('expNetPrice1')
      //   .valueChanges
      //   .subscribe(() => {
      //     this.onExpensesCalVat();
      //   });

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

          const exp = x.filter(o => o.expensesType != EXPT.Service);
          this.expenseServices = x.filter(o => o.expensesType == EXPT.Service);
          if (this.mUser.gId == EURIS.Sale) {
            this.expenses = exp.filter(o => o.expensesType != EXPT.InternalCost);
          } else {
            this.expenses = exp;
          }

          if (this.Car) {
            this.Car.subscribe(o => {
              if (!o) return;
              if (o.freeTag == 1) {
                this.checkBoxEXP10001
                const item = x.find(x => x.expensesCode == EXPTag.EXP10001);
                this.checkBoxEXP10001.nativeElement.checked = true;
                this.addFreeItem(item, EXPTag.EXP10001);
              }
              if (o.freeAct == 1) {
                const item = x.find(x => x.expensesCode == EXPTag.EXP10003);
                this.checkBoxEXP10003.nativeElement.checked = true;
                this.addFreeItem(item, EXPTag.EXP10003);
              }
              if (o.freeWarranty == 1) {
                const item = x.find(x => x.expensesCode == EXPTag.EXP10004);
                this.checkBoxEXP10004.nativeElement.checked = true;
                this.addFreeItem(item, EXPTag.EXP10004);
              }

            });
          }
        }, () => this.loading = 2);

      // this.CarRegisListItem.valueChanges.subscribe(() => this.emitValue(this.CarRegisListItem.getRawValue()));

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

  addFreeItem(item: any, itemTag: string) {
    const fg = this.fb.group({
      runId: 0,
      itemCode: item.expensesCode,
      itemName: item.expensesDescription,
      itemTag: itemTag,
      itemPrice1: 0,
      itemVatPrice1: 0,
      itemNetPrice1: 0,
      itemIsVat: 0,
      itemPrice2: 0,
      itemPrice3: 0,
      itemCutBalance: 0,
      itemPriceTotal: 0,
      children: this.fb.array([])
    });

    let formArray = this.formGroup.get(itemTag) as FormArray;
    formArray.push(fg);
    this.chRef.detectChanges();
  }

  onAddExpItem(formGroup: FormGroup, parentForm: FormArray) {
    const itemTag = parentForm.at(0).get('itemName').value;
    const exp = formGroup.getRawValue();
    const fg = this.fb.group({
      runId: 0,
      itemCode: exp.expitemCode,
      itemName: exp.expItem,
      itemTag: itemTag,
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
    let children = parentForm.at(0).get('children') as FormArray;
    children.push(fg);

    formGroup.patchValue({
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

  onSelectExpenses(item: any, expFormGroup: FormGroup) {
    if (!item) {
      expFormGroup.reset();
      return;
    }
    const isInternalCost = item.expensesType == EXPT.InternalCost;
    expFormGroup.patchValue({
      expitemCode: item ? item.expensesCode : null,
      expPrice1: item ? (isInternalCost ? null : item.expensesAmount) : null,
      expNetPrice1: item ? (isInternalCost ? null : item.expensesAmount) : null,
      expPrice2: item ? (isInternalCost ? item.expensesAmount : null) : null,
    });
  }

  onExpensesCalVat(formGroup: FormGroup) {
    const expPrice1 = (formGroup.get('expIsVat').value && formGroup.get('expNetPrice1').value)
      ? formGroup.get('expNetPrice1').value / 1.07
      : formGroup.get('expNetPrice1').value;

    const expVatPrice1 = formGroup.get('expNetPrice1').value - expPrice1;
    formGroup.patchValue({
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

  // emitValue(value: any[]) {
  //   const obj = [...value].reduce((a, c) =>
  //     [...a, { ...c, itemCutBalance: c.itemNetPrice1 }],
  //     []);
  //   this._IsTagItem = obj.filter(x => x.itemCode == 'EXP10001' || 'EXP10002').length ? false : true;
  //   this._IsActItem = obj.filter(x => x.itemCode == 'EXP10003').length ? false : true;
  //   this._IsWarItem = obj.filter(x => x.itemCode == 'EXP10004').length ? false : true;

  //   this.TagListItem.emit(obj)
  // }

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

  addExpenseForm(tag: string, ele: Event) {
    const checkbox = ele.target as HTMLInputElement;
    if (checkbox.checked) {
      const item = this.expenseServices.find(o => o.expensesCode == tag);
      this.addFreeItem(item, tag);
    } else {
      const exp = this.formGroup.get(tag) as FormArray;
      if (exp.length && confirm('ยืนยันการทำรายการหรือไม่?')) {
        exp.removeAt(0);
      } else {
        checkbox.checked = true;
      }
    }

  }

}  