import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookingFormConfig } from './booking-form.config';
import { IPayment } from 'app/interfaces/payment.interface';
import { message } from 'app/app.message';
import { tap, distinctUntilChanged, debounceTime, switchMap, finalize } from 'rxjs/operators';
import { ProductService } from 'app/services/products';
import { ProductMc } from 'app/models/products';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'app/services/users';
import { of } from 'rxjs';
import { CustomerService } from 'app/services/customers';
import { DropDownModel } from 'app/models/drop-down-model';

@Component({
  selector: 'app-booking-create',
  templateUrl: 'booking-create.component.html',
  styleUrls: ['booking-form.component.scss']
})

export class BookingCreateComponent extends BookingFormConfig implements OnInit {
  protected paymentData: IPayment = {
    paymentPrice: null,
    accBankId: null,
    paymentDate: new Date(),
    options: {
      invalid: true,
      disabled: false
    }
  };

  constructor(
    public chRef: ChangeDetectorRef,
    public fb: FormBuilder,
    public s_product: ProductService,
    public s_user: UserService,
    public s_customer: CustomerService
  ) {
    super();
    this.formPayment = this.paymentData;
    this.PaymentData.next(this.formPayment);
    this.user = s_user.cookies;
  }

  ngOnInit() {
    this.searchProductMc();
    this.searchCustomer();
    // this.formPaymentChange
  }

  searchProductMc() {
    this.productMcTypeahead.pipe(
      tap(() => {
        this.searchProductMcLoading = true;
        this.dropdownLoadingTxt = message.loading;
      }),
      distinctUntilChanged(),
      debounceTime(100),
      switchMap(term => {
        if (term == '') return of(new Array<ProductMc>());
        return this.s_product.GetMCByKeyword(term);
      })
    ).subscribe(x => {
      if (!x.length) {
        this.productMcUnload();
        this.productMcDropdown = new Array<ProductMc>();
      }
      this.chRef.markForCheck();
      this.productMcUnload();
      this.productMcDropdown = x;
      this.productMcDropdown.map(item => {
        item.text = `${item.brandName} ${item.modelName} ${item.colorName}`;
        item.value = item.itemId;
      });
    }, () => {
      this.productMcUnload();
      this.productMcDropdown = new Array<ProductMc>();
    });
  }

  searchCustomer() {
    this.customerTypeahead.pipe(
      tap(() => {
        this.customerLoading = true;
        this.dropdownLoadingTxt = message.loading;
      }),
      distinctUntilChanged(),
      debounceTime(300),
      switchMap(term => this.s_customer.getByKey(term))
    ).subscribe(x => {
      this.chRef.markForCheck();
      this.customerDropdown = x;
      this.customerUnload();
    }, () => {
      this.customerUnload();
      this.customerDropdown = new Array<DropDownModel>();
    });
  }

  selectProductMc(e: ProductMc) {
    if (!e)
      this.formGroupProduct.reset();

    const fg = this.formGroupProduct.getRawValue();
    this.formGroupProduct.patchValue({
      ...fg, ...e
    });
  }

  addProductMc() {
    let fg = this.formGroupProduct.getRawValue();
    fg = { ...fg, itemName: `${fg.brandName} ${fg.modelName} ${fg.colorName}` };
    this.ProductItem.push(this.fb.group(fg));
    this.formGroupProduct.reset();
  }

  removeProductMc(index: number) {
    this.ProductItem.removeAt(index);
  }

  orderChange() {
    const fg = this.formGroupProduct.getRawValue();
    if (fg.sellNet > 0 && fg.orders > 0) {
      const total = fg.orders * fg.sellNet;
      this.formGroupProduct.patchValue({ total, backlogs: fg.orders });
    }
  }

  rowOrderChange(index: number) {
    const fg = this.ProductItem.at(index).value;
    if (fg.sellNet > 0 && fg.orders > 0) {
      const total = fg.orders * fg.sellNet;
      this.ProductItem.at(index).patchValue({ total, backlogs: fg.orders });
    }
  }

  formPaymentChange(event: IPayment) {
    this.formPayment = event;
    this.formGroup.patchValue({
      paymentPrice: event.paymentPrice,
      discountPrice: event.discountPrice,
      totalPaymentPrice: event.paymentPrice,
      accBankId: event.accBankId || null,
      paymentDate: event.paymentDate,
      documentRef: event.documentRef
    });
  }

  onSave() {

  }

}