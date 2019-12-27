import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummarySaleReportByTypeComponent } from './summary-sale-report-by-type.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [SummarySaleReportByTypeComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerTHModule,
    NgSelectModule
  ]
})
export class SummarySaleReportByTypeModule { }
