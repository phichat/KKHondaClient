import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashComponent } from './cash.component';
import { ChequeComponent } from './cheque.component';
import { TransferComponent } from './transfer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CashComponent,
    ChequeComponent,
    TransferComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MyDatePickerTHModule
  ],
  exports: [
    CashComponent,
    ChequeComponent,
    TransferComponent
  ]
})
export class PaymentTypeModule { }
