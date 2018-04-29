import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { SummaryComponent } from './summary/summary.component';
import { MotobikeComponent } from './motobike/motobike.component';
import { AccessoryComponent } from './accessory/accessory.component';
import { CreditComponent } from './credit/credit.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IboxtoolsModule } from '../../../components/common/iboxtools/iboxtools.module';
import { ModalCustomerComponent } from '../../../components/common/modal-customer/modal-customer.component';
import { ModelCustomerComponent } from './model-customer/model-customer.component';
import { SellingComponent } from './selling.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    IboxtoolsModule,
  ],
  declarations: [
    ModalCustomerComponent,
    BookingDetailComponent,
    SummaryComponent,
    MotobikeComponent,
    AccessoryComponent,
    CreditComponent,
    ModelCustomerComponent,
    SellingComponent
  ]
})
export class SellingModule { }
