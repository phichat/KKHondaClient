import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportBookingService } from './report-booking.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportBookingComponent } from './report-booking.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';

@NgModule({
  declarations: [
    ReportBookingComponent
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
    ReportBookingService
  ]
})
export class ReportBookingModule { }
