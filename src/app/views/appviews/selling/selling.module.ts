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
import { NgSelectModule } from '@ng-select/ng-select';
import { IboxtoolsModule } from '../../../components/common/iboxtools/iboxtools.module';
import { InputmaskDirective } from '../../../directives/inputmask.directive';
import { SellingComponent } from './selling.component';
import { ModalCustomerComponent } from './modal-customer/modal-customer.component';

import { SellActivityService } from '../../../services/selling';
import {
  BrandsService,
  CategoriesService,
  ClassesService,
  ColorsService,
  ModelsService,
  ProductService,
  TypesService
} from '../../../services/products';
import { PersonService } from '../../../services/customers';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    IboxtoolsModule,
    NgSelectModule
  ],
  declarations: [
    InputmaskDirective,

    BookingDetailComponent,
    SummaryComponent,
    MotobikeComponent,
    AccessoryComponent,
    CreditComponent,
    ModalCustomerComponent,
    SellingComponent
  ],
  providers: [
    BrandsService,
    CategoriesService,
    ClassesService,
    ColorsService,
    ModelsService,
    ProductService,
    TypesService,
    PersonService,
    SellActivityService
  ]
})
export class SellingModule { }
