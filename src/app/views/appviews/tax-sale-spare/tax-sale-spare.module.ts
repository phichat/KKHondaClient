import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxSaleSpareService } from './tax-sale-spare.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TaxSaleSpareComponent } from './tax-sale-spare.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';

@NgModule({
  declarations: [
    TaxSaleSpareComponent
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
    TaxSaleSpareService
  ]
})
export class TaxSaleSpareModule { }
