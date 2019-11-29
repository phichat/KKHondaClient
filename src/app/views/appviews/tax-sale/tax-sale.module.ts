import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxSaleService } from './tax-sale.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TaxSaleComponent } from './tax-sale.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';

@NgModule({
  declarations: [
    TaxSaleComponent
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
    TaxSaleService
  ]
})
export class TaxSaleModule { }
