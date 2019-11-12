import { MyDatePickerOptions, getDateMyDatepicker, setDateMyDatepicker, setLocalDate } from 'app/app.config';
import { EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IPayment, IPaymentInput } from 'app/interfaces/payment.interface';
import { IBankingDetail } from 'app/interfaces/banking';
import { Subject, BehaviorSubject } from 'rxjs';

export class PaymentTypeConfig {
  // myDatePickerOptions = MyDatePickerOptions;
  // getDateMyDatepicker = getDateMyDatepicker;
  // setDateMyDatepicker = setDateMyDatepicker;
  displayLocalDate = setLocalDate;

  dropDown: any[];
  searchTypeahead = new EventEmitter<string>();
  searchLoading: boolean;
  searchLoadingTxt: string;

  banking: IBankingDetail[];

  formGroup: FormGroup;
  disabledForm = new BehaviorSubject<boolean>(false);

  @Input() $Data: Subject<IPayment>;
  @Output() Payment$ = new EventEmitter<IPayment>();
}