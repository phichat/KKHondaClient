import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRefundBookingService } from './report-refund-booking.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportRefundBookingComponent } from './report-refund-booking.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';

@NgModule({
  declarations: [
    ReportRefundBookingComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerTHModule,
    NgSelectModule
  ], 
  providers: [
    ReportRefundBookingService
  ]
})
export class ReportRefundBookingModule { }
