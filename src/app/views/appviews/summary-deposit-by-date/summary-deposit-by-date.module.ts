import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryDepositByDateComponent } from './summary-deposit-by-date.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [SummaryDepositByDateComponent],
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
export class SummaryDepositByDateModule { }
