import { Component, OnInit } from '@angular/core';
import { PaymentTypeConfig } from './paymey-type.config';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IBankingDetail } from 'app/interfaces/banking';
import { BankingService } from 'app/services/banking';
import { IPayment } from 'app/interfaces/payment.interface';

@Component({
  selector: 'app-payment-type-cheque',
  templateUrl: 'cheque.component.html'
})

export class ChequeComponent extends PaymentTypeConfig implements OnInit {
  constructor(
    private fb: FormBuilder,
    private s_bank: BankingService
  ) {
    super();
    this.formGroup = this.fb.group({
      paymentPrice: new FormControl(0, Validators.required),
      bankCode: new FormControl(null, Validators.required),
      paymentDate: new FormControl(null, Validators.required),
      bankName: new FormControl(null, Validators.required),
      accBankName: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
    const value: IPayment = {
      paymentPrice: 0,
      discountPrice: null,
      totalPaymentPrice: null,
      bankCode: null,
      paymentDate: null,
      invalid: this.formGroup.invalid
    };
    this.Payment$.emit(value);

    this.s_bank.GetBankingAndDetail().subscribe(o => {
      this.banking = o.filter(x => x.accBankNumber != null);
    });

    this.formGroup.valueChanges.subscribe(o => {
      const value: IPayment = {
        paymentPrice: o.paymentPrice,
        discountPrice: 0,
        totalPaymentPrice: o.paymentPrice,
        bankCode: o.bankCode,
        paymentDate: this.getDateMyDatepicker(o.paymentDate),
        invalid: this.formGroup.invalid
      };
      this.Payment$.emit(value);
    })
  }

  selectItem(event: IBankingDetail) {
    this.formGroup.patchValue({
      bankCode: event.bankCode,
      bankName: event.bankName,
      accBankName: event.accBankName
    })
  }

  customSearchFn(term: string, item: IBankingDetail) {
    term = term.toLowerCase();
    return (`${item.accBankNumber} ${item.bankName} ${item.accBankName} ${item.accBankName} ${item.accBankType}`)
      .toLowerCase().indexOf(term) > -1;
  }
}