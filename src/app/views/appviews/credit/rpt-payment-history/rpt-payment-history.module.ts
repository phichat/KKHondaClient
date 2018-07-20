import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RptPaymentHistoryComponent } from './rpt-payment-history.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RptPaymentHistoryComponent],
  exports: [RptPaymentHistoryComponent]
})
export class RptPaymentHistoryModule { }
