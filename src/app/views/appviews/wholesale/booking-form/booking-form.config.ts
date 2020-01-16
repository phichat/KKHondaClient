import { PaymentTypeList, PaymentType } from 'app/entities/general.entities';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { IPayment } from 'app/interfaces/payment.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EventEmitter } from '@angular/core';
import { ProductMc } from 'app/models/products';
import { setLocalDate } from 'app/app.config';
import { IUserResCookie } from 'app/interfaces/users';
import { DropDownModel } from 'app/models/drop-down-model';

export class BookingFormConfig {
  PaymentTypeList = PaymentTypeList;
  PaymentType = PaymentType;
  setLocalDate = setLocalDate;

  user: IUserResCookie;
  formPayment: IPayment;
  productMcTypeahead = new EventEmitter<string>();
  productMcDropdown = new Array<ProductMc>();
  searchProductMcLoading: boolean;
  dropdownLoadingTxt: string;
  customerTypeahead = new EventEmitter<string>();
  customerDropdown: Array<DropDownModel>;
  customerLoading: boolean;
  PaymentData = new BehaviorSubject(null);

  formGroup = new FormGroup({
    bookingDate: new FormControl(new Date(), Validators.required),
    bookingNo: new FormControl(''),
    receiveDate: new FormControl('', Validators.required),
    customerCode: new FormControl('', Validators.required),
    recipient: new FormControl('', Validators.required),
    remark: new FormControl(''),
    paymentType: new FormControl('1'),
    paymentPrice: new FormControl(0),
    discountPrice: new FormControl(0),
    totalPaymentPrice: new FormControl(0),
    accBankId: new FormControl(''),
    bankCode: new FormControl(''),
    paymentDate: new FormControl(new Date()),
    documentRef: new FormControl(''),
    createDate: new FormControl(new Date()),
    createBy: new FormControl(''),
    updateDate: new FormControl(null),
    updateBy: new FormControl(null),
    productItem: new FormArray([])
  });

  formGroupProduct = new FormGroup({
    itemId: new FormControl(null),
    catName: new FormControl(null),
    typeName: new FormControl(null),
    brandName: new FormControl(null),
    modelName: new FormControl(null),
    colorName: new FormControl(null),
    sellNet: new FormControl(null),
    orders: new FormControl(null),
    backlogs: new FormControl(null),
    total: new FormControl(null),
  })

  get ProductItem(): FormArray {
    return this.formGroup.get('productItem') as FormArray;
  }

  productMcUnload() {
    this.searchProductMcLoading = false;
    this.dropdownLoadingTxt = '';
  }

  customerUnload() {
    this.customerLoading = false;
    this.dropdownLoadingTxt = '';
  }
}