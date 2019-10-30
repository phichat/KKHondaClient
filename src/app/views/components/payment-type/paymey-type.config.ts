import { MyDatePickerOptions, getDateMyDatepicker } from 'app/app.config';
import { EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IPayment } from 'app/interfaces/payment.interface';
import { IBankingDetail } from 'app/interfaces/banking';

export class PaymentTypeConfig {
  myDatePickerOptions = MyDatePickerOptions;
  getDateMyDatepicker = getDateMyDatepicker;
  
  dropDown: any[];
  searchTypeahead = new EventEmitter<string>();
  searchLoading: boolean;
  searchLoadingTxt: string;
  
  banking: IBankingDetail[];

  formGroup: FormGroup;

  @Output() Payment$ = new EventEmitter<IPayment>();
}