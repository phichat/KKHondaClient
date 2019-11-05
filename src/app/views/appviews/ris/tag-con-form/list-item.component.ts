import { OnInit, Component, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms';
import { ListItemConfig } from './list-item.config';
import { getDateMyDatepicker, setZeroHours, appConfig } from 'app/app.config';
import { mergeMap, map } from 'rxjs/operators';
import { combineLatest, of, zip } from 'rxjs';
import { RisLocalStoreage as LS, UserForRis as EURIS, ExpensesType as EXPT, ExpensesTag as EXPTag } from 'app/entities/ris.entities';
import { DropDownModel } from 'app/models/drop-down-model';
import { UserService } from 'app/services/users';
import { ExpenseOtherService } from 'app/services/ris';
import { IExpensesOtherRisRes, IConItem } from 'app/interfaces/ris';

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
    private s_user: UserService,
    private s_expense: ExpenseOtherService
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

    this.setExpenseForm();
  }

  @ViewChild("EXP10001") checkBoxEXP10001: ElementRef;
  @ViewChild("EXP10002") checkBoxEXP10002: ElementRef;
  @ViewChild("EXP10003") checkBoxEXP10003: ElementRef;
  @ViewChild("EXP10004") checkBoxEXP10004: ElementRef;

  checkMode: boolean;
  toggleExpenses = true;
  toggleTag = true;

  ngOnInit(): void {
    const status = combineLatest(this.Status1, this.Status2).pipe(
      map((val) => {
        return { status1: val[0], status2: val[1] }
      })
    );

    status.subscribe(x => {
      this.chRef.markForCheck();
      this.disableNotEqualReceive = x.status1 != this.ConStatus1.Received && x.status1 != null;
      this.disableIsEqualSend1 = x.status2 != null;
      this.disableIsEqualSend2 = x.status2 != this.ConStatus2.Send1;

      this.setExpenseForm();
    });

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
      this.s_expense.GetAll().subscribe(x => {
        if (!x.length) {
          this.loading = 1;
          return;
        };
        this.chRef.markForCheck();

        const exp = x.filter(o => o.expensesType != EXPT.Service);
        this.expenseServices = x.filter(o => o.expensesType == EXPT.Service);
        if (this.mUser.gId == EURIS.Sale) {
          this.expenses = exp.filter(o => o.expensesType != EXPT.InternalCost);
        } else if (this.mUser.gId == EURIS.Regist) {
          this.expenses = exp.filter(o => o.expensesType == EXPT.InternalCost);
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

      this.formGroup.valueChanges.subscribe(() => this.emitValue(this.formGroup.getRawValue()));

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
            this.http.get<IConItem[]>(listItemUrl, { params }),
            this.http.get(histotyUrl, { params })
          ).pipe(
            map(o => { return { listItem: o[0], history: o[1] } })
          )
        })
      ).subscribe(x => {
        this.addListItemFromApi(x.listItem);
        this.addHistoryFromApi(x.history);
      })
    }
  }

  private addListItemFromApi(list: IConItem[]) {
    const _01Parent = list.filter(x => x.itemCode == EXPTag.EXP10001);
    const _01Children = list.filter(x => x.itemCode != EXPTag.EXP10001 && x.itemTag == EXPTag.EXP10001);

    const _02Parent = list.filter(x => x.itemCode == EXPTag.EXP10002);
    const _02Children = list.filter(x => x.itemCode != EXPTag.EXP10002 && x.itemTag == EXPTag.EXP10002);

    const _03Parent = list.filter(x => x.itemCode == EXPTag.EXP10003);
    const _03Children = list.filter(x => x.itemCode != EXPTag.EXP10003 && x.itemTag == EXPTag.EXP10003);

    const _04Parent = list.filter(x => x.itemCode == EXPTag.EXP10004);
    const _04Children = list.filter(x => x.itemCode != EXPTag.EXP10004 && x.itemTag == EXPTag.EXP10004);

    const parent = [..._01Parent, ..._02Parent, ..._03Parent, ..._04Parent];

    parent.forEach(item => {
      let fgParent = this.setExpenseFormGroup(item);
      let children = fgParent.get('children') as FormArray;
      switch (item.itemTag) {
        case EXPTag.EXP10001:
          this.checkBoxEXP10001.nativeElement.checked = true;
          _01Children.forEach(child => {
            children.push(this.setExpenseFormGroup(child));
          })
          break;
        case EXPTag.EXP10002:
          this.checkBoxEXP10002.nativeElement.checked = true;
          _02Children.forEach(child => {
            children.push(this.setExpenseFormGroup(child));
          })
          break;
        case EXPTag.EXP10003:
          this.checkBoxEXP10003.nativeElement.checked = true;
          _03Children.forEach(child => {
            children.push(this.setExpenseFormGroup(child));
          })
          break;
        case EXPTag.EXP10004:
          this.checkBoxEXP10004.nativeElement.checked = true;
          _04Children.forEach(child => {
            children.push(this.setExpenseFormGroup(child));
          });
          break;
      }
      const parent = this.formGroup.get(item.itemTag) as FormArray
      parent.push(fgParent);
    });
    this.chRef.detectChanges();
  }

  private setExpenseFormGroup(item: IConItem): FormGroup {

    const checkMode = this.Mode == this.ActionMode.Detail;
    const disabledIsExpenses = this.expType.Expenses == item.itemType;
    const disabledIsPayment = item.paymentStatus == 1;
    this.disabledHistoryForm(item.itemTag, checkMode ? true : false);
    return this.fb.group({
      ...item,
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
        disabled: (checkMode || this.disabledItemPrice2 || disabledIsExpenses || disabledIsPayment) ? true : false
      }),
      itemPrice3: new FormControl({
        value: item.itemPrice3,
        disabled: (checkMode || this.disabledItemPrice3 || disabledIsExpenses || disabledIsPayment) ? true : false
      }),
      itemPriceTotal: item.itemNetPrice1 + item.itemPrice2 + item.itemPrice3,
      children: this.fb.array([])
    });
  }

  private addHistoryFromApi(item: any) {
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

  private addFreeItem(item: IExpensesOtherRisRes, itemTag: string) {
    const fg = this.fb.group({
      runId: 0,
      itemCode: item.expensesCode,
      itemName: item.expensesDescription,
      itemType: item.expensesType,
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
    this.disabledHistoryForm(itemTag, false);

    this.chRef.detectChanges();
  }

  onAddExpItem(formGroup: FormGroup, parentForm: FormArray) {
    const itemTag = parentForm.at(0).get('itemCode').value;
    const exp = formGroup.getRawValue();
    const fg = this.fb.group({
      runId: 0,
      itemCode: exp.expitemCode,
      itemName: exp.expItem,
      itemType: exp.expItemType,
      itemPrice1: exp.expPrice1,
      itemVatPrice1: exp.expVatPrice1,
      itemTag: itemTag,
      itemNetPrice1: new FormControl({
        value: exp.expNetPrice1,
        disabled: this.disableNotEqualSale ? true : false
      }),
      itemCutBalance: exp.expNetPrice1,
      itemIsVat: new FormControl({
        value: exp.expIsVat,
        disabled: this.disableNotEqualSale ? true : false
      }),
      itemPrice2: new FormControl({
        value: exp.expPrice2,
        disabled: this.disabledItemPrice2 ? true : false
      }),
      itemPrice3: new FormControl({
        value: exp.expPrice3,
        disabled: this.disabledItemPrice3 ? true : false
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

  onSelectExpenses(item: IExpensesOtherRisRes, expFormGroup: FormGroup) {
    if (!item) {
      expFormGroup.reset();
      return;
    }
    const ele = item ? item : null;
    const isInternalCost = item.expensesType == EXPT.InternalCost;
    expFormGroup.patchValue({
      expitemCode: ele.expensesCode,
      expItemType: ele.expensesType,
      expPrice1: isInternalCost ? null : ele.expensesAmount,
      expNetPrice1: isInternalCost ? null : ele.expensesAmount,
      expPrice2: this.disabledItemPrice2 == true ? null : (isInternalCost ? ele.expensesAmount : null),
      expPrice3: this.disabledItemPrice3 == true ? null : (isInternalCost ? ele.expensesAmount : null)
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

  onItemCalVat(childIndex: number, parent: FormGroup) {
    const child = parent.get('children') as FormArray;
    let list = child.at(childIndex);
    const itemPrice1 = list.get('itemIsVat').value && list.get('itemNetPrice1').value
      ? list.get('itemNetPrice1').value / 1.07
      : list.get('itemNetPrice1').value;

    const itemVatPrice1 = list.get('itemNetPrice1').value - itemPrice1;
    list.patchValue({
      itemPrice1,
      itemVatPrice1
    });
  }

  onRemoveExpenseItem(childIndex: number, parent: FormGroup) {
    const child = parent.get('children') as FormArray;
    const item = child.at(childIndex);
    if (!confirm(`ยืนยันการลบรายการ "${item.get('itemName').value}" หรือไม่?`)) return;

    if (this.Mode == this.ActionMode.Edit) {
      let rmItem = (JSON.parse(localStorage.getItem(LS.TrashCarRegisListItem)) || []) as any[];
      rmItem = [...rmItem, item.value];
      localStorage.setItem(LS.TrashCarRegisListItem, JSON.stringify(rmItem));
    }
    child.removeAt(childIndex);
  }

  private emitValue(value: any) {
    let _01 = value[EXPTag.EXP10001] as any[];
    let _02 = value[EXPTag.EXP10002] as any[];
    let _03 = value[EXPTag.EXP10003] as any[];
    let _04 = value[EXPTag.EXP10004] as any[];
    _01 = _01.length ? [..._01, ..._01[0].children] : [];
    _02 = _02.length ? [..._02, ..._02[0].children] : [];
    _03 = _03.length ? [..._03, ..._03[0].children] : [];
    _04 = _04.length ? [..._04, ..._04[0].children] : [];
    let summary = [..._01, ..._02, ..._03, ..._04];
    this.TagListItem.emit(summary);
  }

  private emitValueTagHistory(value: any) {
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

  addExpenseForm(tag: string, ele: Event) {
    const checkbox = ele.target as HTMLInputElement;
    if (checkbox.checked) {
      const item = this.expenseServices.find(o => o.expensesCode == tag);
      this.addFreeItem(item, tag);
    } else {
      const exp = this.formGroup.get(tag) as FormArray;
      if (exp.length && confirm('ยืนยันการทำรายการหรือไม่?')) {
        if (this.Mode == this.ActionMode.Edit) {
          const parent = exp.at(0);
          const children = parent.get('children') as FormArray;
          let rmItem = (JSON.parse(localStorage.getItem(LS.TrashCarRegisListItem)) || []) as any[];
          rmItem = [...rmItem, ...[parent.value, ...children.value]];
          localStorage.setItem(LS.TrashCarRegisListItem, JSON.stringify(rmItem));
        }
        exp.removeAt(0);
        this.disabledHistoryForm(tag, true);
      } else {
        checkbox.checked = true;
      }
    }

  }

  private disabledHistoryForm(tag: string, value: boolean) {
    switch (tag) {
      case EXPTag.EXP10001:
      case EXPTag.EXP10002:
        const _01 = this.formGroup.get(EXPTag.EXP10001) as FormArray;
        const _02 = this.formGroup.get(EXPTag.EXP10002) as FormArray;
        if (!_01.length && !_02.length && value == true) {
          this._IsTagItem = value;
        } else if (value == false) {
          this._IsTagItem = value;
        }
        break;

      case EXPTag.EXP10003:
        this._IsActItem = value;
        break;

      case EXPTag.EXP10004:
        this._IsWarItem = value;
        break;
    }
  }

}  