import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { PaymentService } from 'app/services/credit/payment.service';
import { FormsModule } from '@angular/forms';
import { PageLoadWarpperService } from '../../../../services/common/page-load-warpper.service';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  declarations: [PaymentComponent],
  providers: [
    PaymentService,
    PageLoadWarpperService
  ]
})
export class PaymentModule { }
