import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxPurchaseService } from './tax-purchase.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TaxPurchaseComponent } from './tax-purchase.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';

@NgModule({
  declarations: [
    TaxPurchaseComponent
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
    TaxPurchaseService
  ]
})
export class TaxPurchaseModule { }
