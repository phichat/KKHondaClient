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
  protected PaymentTypeList = PaymentTypeList;
  protected PaymentType = PaymentType;
  protected setLocalDate = setLocalDate;

  protected user: IUserResCookie;
  protected formPayment: IPayment;
  protected productMcTypeahead = new EventEmitter<string>();
  protected productMcDropdown = new Array<ProductMc>();
  protected searchProductMcLoading: boolean;
  protected dropdownLoadingTxt: string;
  protected customerTypeahead = new EventEmitter<string>();
  protected customerDropdown: Array<DropDownModel>;
  protected customerLoading: boolean;
  protected PaymentData = new BehaviorSubject(null);

  protected formGroup = new FormGroup({
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

  protected formGroupProduct = new FormGroup({
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

  protected get ProductItem(): FormArray {
    return this.formGroup.get('productItem') as FormArray;
  }

  protected productMcUnload() {
    this.searchProductMcLoading = false;
    this.dropdownLoadingTxt = '';
  }

  protected customerUnload() {
    this.customerLoading = false;
    this.dropdownLoadingTxt = '';
  }
}