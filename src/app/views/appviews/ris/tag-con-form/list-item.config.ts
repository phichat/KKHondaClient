import { TagConFormConfig } from './tag-con-form.config';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Output, Input, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionMode } from 'app/entities/general.entities';
import { DropDownModel } from 'app/models/drop-down-model';
import { ExpensesTag as EXPTag, ExpensesType } from 'app/entities/ris.entities';
import { IExpensesOtherRisRes } from 'app/interfaces/ris';
import { ITag } from './tag.interface';


export class ListItemConfig extends TagConFormConfig {
  public formGroup: FormGroup;
  public formExpensesEXP10001: FormGroup;
  public formExpensesEXP10002: FormGroup;
  public formExpensesEXP10003: FormGroup;
  public formExpensesEXP10004: FormGroup;
  public formCarHistory: FormGroup;
  public expenses: any[] = [];
  public expenseServices: IExpensesOtherRisRes[] = [];
  public loading: number;
  public provinceDropdown: DropDownModel[];
  public insureDropdown: DropDownModel[];
  expType = ExpensesType;
  EXPTag = EXPTag;

  equalSale: boolean;
  equalRis: boolean;
  disableNotEqualSale: boolean;
  disableNotEqualRis: boolean;
  disableNotEqualReceive: boolean = true;
  disableIsEqualSend1: boolean = true;
  disableIsEqualSend2: boolean = true;

  ExpenseTagList: any[] = [
    EXPTag.EXP10001,
    EXPTag.EXP10002,
    EXPTag.EXP10003,
    EXPTag.EXP10004
  ];

  getFormExpense(form: string): FormGroup {
    switch (form) {
      case EXPTag.EXP10001:
        return this.formExpensesEXP10001;
      case EXPTag.EXP10002:
        return this.formExpensesEXP10002;
      case EXPTag.EXP10003:
        return this.formExpensesEXP10003;
      case EXPTag.EXP10004:
        return this.formExpensesEXP10004;
    }
  }

  setExpenseForm() {

    this.formExpensesEXP10001 = new FormGroup({
      expitemCode: new FormControl(null),
      expItem: new FormControl(null),
      expItemType: new FormControl(null),
      expTag: new FormControl(null),
      expPrice1: new FormControl(null),
      expVatPrice1: new FormControl(null),
      expNetPrice1: new FormControl({ value: null, disabled: this.disableNotEqualSale ? true : false }),
      expIsVat: new FormControl({ value: false, disabled: this.disableNotEqualSale ? true : false }),
      expPrice2: new FormControl({ value: null, disabled: this.disabledItemPrice2 ? true : false }),
      expPrice3: new FormControl({ value: null, disabled: this.disabledItemPrice3 ? true : false })
    })
    this.formExpensesEXP10002 = new FormGroup({
      expitemCode: new FormControl(null),
      expItem: new FormControl(null),
      expItemType: new FormControl(null),
      expTag: new FormControl(null),
      expPrice1: new FormControl(null),
      expVatPrice1: new FormControl(null),
      expNetPrice1: new FormControl({ value: null, disabled: this.disableNotEqualSale ? true : false }),
      expIsVat: new FormControl({ value: false, disabled: this.disableNotEqualSale ? true : false }),
      expPrice2: new FormControl({ value: null, disabled: this.disabledItemPrice2 ? true : false }),
      expPrice3: new FormControl({ value: null, disabled: this.disabledItemPrice3 ? true : false })
    })
    this.formExpensesEXP10003 = new FormGroup({
      expitemCode: new FormControl(null),
      expItem: new FormControl(null),
      expItemType: new FormControl(null),
      expTag: new FormControl(null),
      expPrice1: new FormControl(null),
      expVatPrice1: new FormControl(null),
      expNetPrice1: new FormControl({ value: null, disabled: this.disableNotEqualSale ? true : false }),
      expIsVat: new FormControl({ value: false, disabled: this.disableNotEqualSale ? true : false }),
      expPrice2: new FormControl(null),
      expPrice3: new FormControl(null)
    })
    this.formExpensesEXP10004 = new FormGroup({
      expitemCode: new FormControl(null),
      expItem: new FormControl(null),
      expItemType: new FormControl(null),
      expTag: new FormControl(null),
      expPrice1: new FormControl(null),
      expVatPrice1: new FormControl(null),
      expNetPrice1: new FormControl({ value: null, disabled: this.disableNotEqualSale ? true : false }),
      expIsVat: new FormControl({ value: false, disabled: this.disableNotEqualSale ? true : false }),
      expPrice2: new FormControl(null),
      expPrice3: new FormControl(null)
    })
  }

  get CarRegisListItem(): FormArray {
    return this.formGroup.get('CarRegisListItem') as FormArray;
  }

  getFormArray(expTag: string): FormArray {
    return this.formGroup.get(expTag) as FormArray;
  }

  getChildrenFormArray(parent: FormControl): FormArray {
    return parent.get('children') as FormArray;
  }

  get EXP10002(): FormArray {
    return this.formGroup.get(EXPTag.EXP10002) as FormArray;
  }

  get EXP10003(): FormArray {
    return this.formGroup.get(EXPTag.EXP10003) as FormArray;
  }

  get EXP10004(): FormArray {
    return this.formGroup.get(EXPTag.EXP10004) as FormArray;
  }

  public _IsTagItem: boolean = true;
  get IsTagItem(): boolean {
    return this._IsTagItem;
  }

  public _IsActItem: boolean = true;
  get IsActItem(): boolean {
    return this._IsActItem;
  }

  public _IsWarItem: boolean = true;
  get IsWarItem(): boolean {
    return this._IsWarItem;
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

  get disabledItemPrice3(): boolean {
    return (this.disableNotEqualRis || this.disableIsEqualSend2) ? true : false
  }

  @Input() BookingId: BehaviorSubject<number>;
  @Input() Status1: BehaviorSubject<number>;
  @Input() Status2: BehaviorSubject<number>;
  @Input() Car?: BehaviorSubject<any>;
  @Input() Mode: ActionMode;
  @Output() TagListItem = new EventEmitter<any[]>();

  @Input() Tag?: BehaviorSubject<ITag>;
  @Output() TagHistory = new EventEmitter<any[]>();
}