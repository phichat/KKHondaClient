import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportTopProductService } from './report-top-product.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportTopProductComponent } from './report-top-product.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';

@NgModule({
  declarations: [
    ReportTopProductComponent
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
    ReportTopProductService
  ]
})
export class ReportTopProductModule { }
