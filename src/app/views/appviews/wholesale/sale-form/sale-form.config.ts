import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { IUserResCookie } from 'app/interfaces/users';
import { setLocalDate } from 'app/app.config';
import { EventEmitter } from '@angular/core';
import { DropDownModel } from 'app/models/drop-down-model';

export class SaleFormConfig {
   setLocalDate = setLocalDate;
   user: IUserResCookie;
   dropdownLoadingTxt: string;
   customerTypeahead = new EventEmitter<string>();
   customerDropdown: Array<DropDownModel>;
   customerLoading: boolean;
  
   formGroup = new FormGroup({
    bookingDate: new FormControl(new Date(), Validators.required),
    bookingNo: new FormControl(''),
    receiveDate: new FormControl('', Validators.required),
    customerCode: new FormControl('', Validators.required),
    customerFullName: new FormControl(null),
    customerFullAddress: new FormControl(null),
    contractHire: new FormControl(null, Validators.required),
    deliverAddress: new FormControl(null),
    deliverAmphorCode: new FormControl(null),
    deliverProvinceCode: new FormControl(null),
    productType: new FormControl(null, Validators.required),
    remark: new FormControl(null),

    createDate: new FormControl(new Date()),
    createBy: new FormControl(null),
    updateDate: new FormControl(null),
    updateBy: new FormControl(null),
    productItem: new FormArray([])
  });

   get ProductItem(): FormArray {
    return this.formGroup.get('productItem') as FormArray;
  }
}