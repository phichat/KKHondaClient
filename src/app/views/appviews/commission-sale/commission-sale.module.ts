import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommissionSaleService } from './commission-sale.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommissionSaleComponent } from './commission-sale.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';

@NgModule({
  declarations: [
    CommissionSaleComponent
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
    CommissionSaleService
  ]
})
export class CommissionSaleModule { }
