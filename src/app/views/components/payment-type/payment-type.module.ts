import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashComponent } from './cash.component';
import { ChequeComponent } from './cheque.component';
import { TransferComponent } from './transfer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThaiMatDatepickerModule } from 'app/components/common/thai-mat-datepicker/thai-mat-datepicker.module';

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
    ThaiMatDatepickerModule,
  ],
  exports: [
    CashComponent,
    ChequeComponent,
    TransferComponent
  ]
})
export class PaymentTypeModule { }
