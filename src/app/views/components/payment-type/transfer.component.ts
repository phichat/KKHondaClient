import { Component, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { PaymentTypeConfig } from './paymey-type.config';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BankingService } from 'app/services/masters';
import { IBankingDetail } from 'app/interfaces/banking';
import { IPayment, IPaymentInput } from 'app/interfaces/payment.interface';
import { mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-payment-type-transfer',
  templateUrl: 'transfer.component.html'
})

export class TransferComponent extends PaymentTypeConfig implements OnInit {
  constructor(
    private fb: FormBuilder,
    private s_bank: BankingService,
    private chRef: ChangeDetectorRef
  ) {
    super();
    this.formGroup = this.fb.group({
      paymentPrice: new FormControl(null, Validators.required),
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
      paymentPrice: null,
      options: {
        invalid: this.formGroup.invalid,
        disabled: false
      }

    };
    this.Payment$.emit(value);


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
      const observe = this.$Data
        .pipe(
          mergeMap(x => {
            const getBookBank = (id: number) => this.s_bank.GetBookBankById(`${id}`).pipe(
              map(o => {
                return {
                  ...x,
                  bankName: o.bankName,
                  accBankName: o.accBankName,
                  accBankNumber: o.accBankNumber,
                } as IPaymentInput;
              }),
            );
            return getBookBank(x.accBankId);
          }),
        );

      observe.subscribe(x => {
        this.chRef.markForCheck();
        if (x.options.disabled) {
          this.formGroup.disable();
          this.disabledForm.next(true);
        } else {
          this.loadBookBank();
          this.disabledForm.next(false);
        }
        this.formGroup.patchValue({ ...x });
      });
    } else {
      this.loadBookBank();
    }
  }

  private loadBookBank(): void {
    this.s_bank.GetBookBank().subscribe(o => {
      this.banking = o.filter(x => x.accBankNumber != null);
    });
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