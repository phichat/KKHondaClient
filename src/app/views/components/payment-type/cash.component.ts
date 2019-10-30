import { Component, OnInit } from '@angular/core';
import { PaymentTypeConfig } from './paymey-type.config';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IPayment } from 'app/interfaces/payment.interface';

@Component({
  selector: 'app-payment-type-cash',
  templateUrl: 'cash.component.html'
})

export class CashComponent extends PaymentTypeConfig implements OnInit {
  constructor(
    private fb: FormBuilder
  ) {
    super();
    this.formGroup = this.fb.group({
      paymentPrice: new FormControl(0, Validators.required),
      discount: new FormControl(null),
      totalPaymentPrice: new FormControl(null),
      paymentDate: new FormControl(null, Validators.required)
    });
  }

  get totalPaymentPrice(): number {
    return this.formGroup.get('paymentPrice').value - this.formGroup.get('discount').value;
  }

  ngOnInit() {
    const value: IPayment = {
      paymentPrice: 0,
      discountPrice: null,
      totalPaymentPrice: null,
      paymentDate: null,
      invalid: this.formGroup.invalid
    };
    this.Payment$.emit(value);
    
    this.formGroup.valueChanges.subscribe(o => {
      const value: IPayment = {
        paymentPrice: o.paymentPrice,
        discountPrice: o.discount,
        totalPaymentPrice: this.totalPaymentPrice,
        paymentDate: this.getDateMyDatepicker(o.paymentDate),
        invalid: this.formGroup.invalid
      };
      this.Payment$.emit(value);
    });
  }


}