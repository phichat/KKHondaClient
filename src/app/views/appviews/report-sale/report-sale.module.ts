import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSaleComponent } from './report-sale.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportSaleService} from './report-sale.service';
@NgModule({
  declarations: [ReportSaleComponent],
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
    ReportSaleService
  ]
})
export class ReportSaleModule { }
