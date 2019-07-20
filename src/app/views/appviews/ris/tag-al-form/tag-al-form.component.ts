import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModelUser } from 'app/models/users';
import { FormArray, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/services/users';
import { message } from 'app/app.message';
import { DropDownModel } from 'app/models/drop-down-model';
import { appConfig } from 'app/app.config';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/operators';

declare var toastr: any;
@Component({
  selector: 'app-tag-al-form',
  templateUrl: './tag-al-form.component.html',
  styleUrls: ['./tag-al-form.component.scss']
})
export class TagAlFormComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private s_user: UserService,
    private chRef: ChangeDetectorRef
  ) {
    toastr.options = {
      'closeButton': true,
      'progressBar': true,
    }
  }
  checkedAll: boolean;
  mUser: ModelUser;
  bankingsDropdown = new Array<DropDownModel>();

  ngOnInit() {
    const carList = `${appConfig.apiUrl}/Ris/CarRegisList`;
    const bank = `${appConfig.apiUrl}/Bank/DropDown`;
    this.http.get(bank).subscribe((x: any[]) => {
      this.chRef.markForCheck();
      this.bankingsDropdown = x;
      this.chRef.detectChanges();
    });

    this.http.get(carList).subscribe((x: any[]) => {
      const res = x.reduce((a, c) =>
        [
          ...a,
          {
            ...c, IS_CHECKED: false, bookingNo: c.bookingNo.replace('CON', 'SED')
          }
        ], []);
      this.setItemFormArray(res, this.formGroup, 'SedList');

      // this.SedList.valueChanges.subscribe((x: any[]) => {
      //   const price = x.filter(o => o.IS_CHECKED);
      //   const totalPrice = price.reduce((a, c) => a += (c.price1 + c.price2), 0);
      //   const price1 = price.reduce((a, c) => a += c.price1, 0);
      //   const price2 = price.reduce((a, c) => a += c.price2, 0);
      //   this.formGroup.patchValue({
      //     totalPrice: totalPrice, 
      //     price1: price1,
      //     price2: price2
      //   })
      // })
    });
  }

  get SedList(): FormArray {
    return this.formGroup.get('SedList') as FormArray;
  }

  public formGroup = this.fb.group({
    typePayment: new FormControl('1'),
    createDate: new FormControl(new Date()),
    createBy: new FormControl(null),
    totalPrice: new FormControl(0),
    price1: new FormControl(0),
    price2: new FormControl(0),
    borrowMoney: new FormControl(0),
    SedList: this.fb.array([])
  });

  checkAll(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    for (let index = 0; index < this.SedList.value.length; index++) {
      this.SedList.at(index).get('IS_CHECKED').patchValue(checkbox.checked);
    }
  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }

  onSubmit() {

    toastr.success(message.created);
  }
}
