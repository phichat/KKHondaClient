import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportTopProductSpareService } from './report-top-product-spare.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportTopProductSpareComponent } from './report-top-product-spare.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';

@NgModule({
  declarations: [
    ReportTopProductSpareComponent
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
    ReportTopProductSpareService
  ]
})
export class ReportTopProductSpareModule { }
