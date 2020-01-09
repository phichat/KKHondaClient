import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { components as booking } from './booking-form';
import { components as sale} from './sale-form';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThaiMatDatepickerModule } from 'app/components/common/thai-mat-datepicker/thai-mat-datepicker.module';
import { PaymentTypeModule } from 'app/views/components/payment-type/payment-type.module';

const routes: Routes = []

@NgModule({
  imports: [
    // RouterModule.forChild(routes)
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    PaymentTypeModule,
    ThaiMatDatepickerModule
  ],
  exports: [],
  declarations: [
    ...booking,
    ...sale
  ],
})
export class WholeSaleModule { }