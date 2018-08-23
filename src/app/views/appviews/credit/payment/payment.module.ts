import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { PaymentService } from 'app/services/credit/payment.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [PaymentComponent],
  providers: [
    PaymentService
  ]
})
export class PaymentModule { }
