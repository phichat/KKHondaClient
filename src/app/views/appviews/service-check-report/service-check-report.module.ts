import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCheckReportComponent } from './service-check-report.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [ServiceCheckReportComponent],
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
export class ServiceCheckReportModule { }
