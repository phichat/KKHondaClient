import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { PaymentTypeConfig } from './paymey-type.config';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IBankingDetail } from 'app/interfaces/banking';
import { BankingService } from 'app/services/masters';
import { IPayment } from 'app/interfaces/payment.interface';

@Component({
  selector: 'app-payment-type-cheque',
  templateUrl: 'cheque.component.html'
})

export class ChequeComponent extends PaymentTypeConfig implements OnInit, AfterViewInit {
  constructor(
    private fb: FormBuilder,
    private s_bank: BankingService,
    private chRef: ChangeDetectorRef
  ) {
    super();
    this.formGroup = this.fb.group({
      paymentPrice: new FormControl(0, Validators.required),
      discount: new FormControl(null),
      totalPaymentPrice: new FormControl(null),
      paymentDate: new FormControl(null, Validators.required),
      accBankId: new FormControl(null, Validators.required),
      bankName: new FormControl(null, Validators.required),
      accBankName: new FormControl(null, Validators.required),
      accBankNumber: new FormControl(null, Validators.required),
      documentRef: new FormControl(null)
    });
  }

  ngOnInit() {

    this.disabledForm.next(false);
    const value: IPayment = {
      paymentPrice: 0,
      options: {
        invalid: this.formGroup.invalid,
        disabled: false
      }

    };
    this.Payment$.emit(value);

    this.s_bank.GetBookBank().subscribe(o => {
      this.banking = o.filter(x => x.accBankNumber != null);
    });

    this.formGroup.valueChanges.subscribe(o => {
      const value: IPayment = {
        paymentPrice: o.paymentPrice,
        discountPrice: 0,
        totalPaymentPrice: o.paymentPrice,
        accBankId: o.accBankId,
        paymentDate: this.getDateMyDatepicker(o.paymentDate),
        documentRef: o.documentRef,
        options: {
          invalid: this.formGroup.invalid,
          disabled: false
        }
      };
      this.Payment$.emit(value);
    })
  }

  ngAfterViewInit(): void {
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

  selectItem(event: IBankingDetail) {
    this.formGroup.patchValue({
      bankName: event.bankName,
      accBankName: event.accBankName,
      accBankNumber: event.accBankNumber
    })
  }

  customSearchFn(term: string, item: IBankingDetail) {
    term = term.toLowerCase();
    return (`${item.accBankNumber} ${item.bankName} ${item.accBankName} ${item.accBankName} ${item.accBankType}`)
      .toLowerCase().indexOf(term) > -1;
  }
}