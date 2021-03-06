import { OnInit, Component, ChangeDetectorRef } from '@angular/core';
import { ListConItemDetailConfig } from './list-con-item-detail.config';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { mergeMap, tap } from 'rxjs/operators';
import { ICarRegisItemRes, IConItemRes } from 'app/interfaces/ris';
import { of } from 'rxjs';
import { UserService } from 'app/services/users/user.service';
import { ClearMoneyService } from './clear-money.service';
import { CarRegisItemService } from 'app/services/ris';

@Component({
  selector: 'app-list-con-item-detail-component',
  templateUrl: './list-con-item-detail.component.html'
})
export class ListConItemDetailComponent extends ListConItemDetailConfig implements OnInit {

  constructor(
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private s_user: UserService,
    private s_clearMoney: ClearMoneyService,
    private s_carRegisItem: CarRegisItemService
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      ConListItem: this.fb.array([]),
      ConListItemDoc: this.fb.array([])
    });

    this.searchDataWithBookingNo();

    this.s_user.currentData.subscribe(x => {
      if (!x) return;
      this.chRef.markForCheck();
      this.mUser = x;
      this.chRef.detectChanges();
    });
  }

  private searchDataWithBookingNo() {
    this.$ConNo.pipe(
      tap((x) => {
        this.loading = this.LoadEnt.loading;
        this.ClearConListItem(x);
        this.ClearConListItemDoc(x);
      }),
      mergeMap(x => {
        if (!x) return of(null as ICarRegisItemRes);
        const listCon = this.s_clearMoney.ListConItem.filter(o => o.bookingNo == x);
        const listConItemDoc = this.s_clearMoney.ListConItemDoc.filter(o => o.bookingNo == x);
        if (listCon.length && listConItemDoc.length) {
          return of(
            {
              carRegisListItemRes: listCon,
              carRegisListItemDocRes: listConItemDoc
            });
        }
        return this.s_carRegisItem.GetByConNo(x)
      }),
      // delay(300)
    ).subscribe(x => {
      if (x == null) {
        this.loading = this.LoadEnt.noRecord;
        return;
      };

      const listConItem = x.carRegisListItemRes
        .map(o => {
          // if (o.dateReceipt != null) {
          //   o.dateReceipt = o.dateReceipt.date ? o.dateReceipt : this.setDateMyDatepicker(o.dateReceipt);
          // }
          o.state = o.state != null ? o.state.toString() : null;
          return o;
        });

      this.setItemFormArray(listConItem, this.formGroup, 'ConListItem');
      this.ConListItemValueChange(listConItem);

      const listItemDoc = x.carRegisListItemDocRes;
      this.setItemFormArray(listItemDoc, this.formGroup, 'ConListItemDoc');
      this.ConListItemDocValueChange(listItemDoc);

    }, () => this.loading = this.LoadEnt.error);
  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => {
        if (this.$Mode == this.ActionMode.Detail) {
          let i = {};
          for (const key in item) {
            item[key] = new FormControl({ value: item[key], disabled: true });
            i = { ...i, [key]: item[key] };
          }
          return this.fb.group(i);
        }
        return this.fb.group(item);
      });
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }

  public onReceiveDoc(index: number, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const item = this.ConListItemDoc.at(index);
    item.patchValue({
      receiveDate: checkbox.checked ? (new Date()) : null,
      receiveBy: checkbox.checked ? this.mUser.id : null,
      receiveName: checkbox.checked ? this.mUser.fullName : null
    });
  }

  public onSendDoc(index: number, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const item = this.ConListItemDoc.at(index);
    item.patchValue({
      sendDate: checkbox.checked ? (new Date()) : null,
      sendBy: checkbox.checked ? this.mUser.id : null,
      sendName: checkbox.checked ? this.mUser.fullName : null
    });
  }

  private ConListItemValueChange(value) {
    this.s_clearMoney.setListConItemBehaviorSubject(value)
    this.ConListItem.valueChanges.subscribe((x: IConItemRes[]) => {
      if (!x.length) return;
      this.s_clearMoney.setListConItemBehaviorSubject(x);
      const state1 = x.filter(o => o.state != null).length ? 1 : null;
      const cutBalance = x.reduce((a, c) => {
        return (c.state != 2 && c.state != 3) ? a += c.itemCutBalance : a;
      }, 0);

      let state2 = null;
      if (x.filter(o => o.state == 1).length == x.length) {
        state2 = 1
      } else {
        state2 = x.filter(o => o.state == 2).length ? 2 : 3;
      }

      this.ConItemOutput$.emit({
        conNo: x[0].bookingNo,
        state1: state1,
        state2: state2,
        cutBalance: cutBalance
      });
    });
  }

  private ConListItemDocValueChange(value) {
    this.s_clearMoney.setListConItemDocBehaviorSubject(value);
    this.ConListItemDoc.valueChanges.subscribe(x => {
      this.s_clearMoney.setListConItemDocBehaviorSubject(x);
    })
  }

  private ClearConListItemDoc(conNo: string) {
    while (this.ConListItemDoc.length) this.ConListItemDoc.removeAt(0);
    if (!conNo) this.s_clearMoney.clearListConItemDocBehaviorSubject();
  }

  private ClearConListItem(conNo: string) {
    while (this.ConListItem.length) this.ConListItem.removeAt(0);
    if (!conNo) this.s_clearMoney.clearListConItemBehaviorSubject();
  }

}