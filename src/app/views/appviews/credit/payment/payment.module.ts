import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { PaymentService } from 'app/services/credit/payment.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageLoadWarpperService } from '../../../../services/common/page-load-warpper.service';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MyDatePickerTHModule } from 'mydatepicker-th';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgSelectModule,
    MyDatePickerTHModule
  ],
  declarations: [PaymentComponent],
  providers: [
    PaymentService,
    PageLoadWarpperService
  ]
})
export class PaymentModule { }
