import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { PaymentTypeConfig } from './paymey-type.config';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IPayment } from 'app/interfaces/payment.interface';
import { setZeroHours } from 'app/app.config';

@Component({
  selector: 'app-payment-type-cash',
  templateUrl: 'cash.component.html'
})

export class CashComponent extends PaymentTypeConfig implements OnInit, AfterViewInit {

  constructor(
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef
  ) {
    super();
    this.formGroup = this.fb.group({
      paymentPrice: new FormControl(null, Validators.required),
      discount: new FormControl(null),
      totalPaymentPrice: new FormControl(null),
      paymentDate: new FormControl(null, Validators.required)
    });
  }

  get totalPaymentPrice(): number {
    return this.formGroup.get('paymentPrice').value - this.formGroup.get('discount').value;
  }

  ngOnInit() {
    this.disabledForm.next(false);
    const value: IPayment = {
      paymentPrice: null,
      discountPrice: null,
      totalPaymentPrice: null,
      paymentDate: null,
      documentRef: null,
      options: {
        invalid: this.formGroup.invalid,
        disabled: false
      }
    };
    this.Payment$.emit(value);

    this.formGroup.valueChanges.subscribe(o => {
      const value: IPayment = {
        paymentPrice: o.paymentPrice,
        discountPrice: o.discount,
        totalPaymentPrice: this.totalPaymentPrice,
        paymentDate: setZeroHours(o.paymentDate),
        documentRef: null,
        options: {
          invalid: this.formGroup.invalid,
          disabled: false
        }
      };
      this.Payment$.emit(value);
    });
    if (this.$Data != undefined) {
      this.$Data.subscribe(x => {
        this.chRef.markForCheck();
        this.formGroup.patchValue({ ...x });
        if (x.options.disabled) {
          this.formGroup.disable();
          this.disabledForm.next(true);
        } else {
          this.disabledForm.next(false);
        }
      });
    }
  }

  ngAfterViewInit(): void {

  }
}