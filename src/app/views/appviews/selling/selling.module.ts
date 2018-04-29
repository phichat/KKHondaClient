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
import { SellingComponent } from './selling.component';
import { ModalCustomerComponent } from './modal-customer/modal-customer.component';
import { SelectizeDirective } from '../../../directives/selectize.directive';
import { TypesService } from '../../../services/products/types.service';
import { CategoriesService } from '../../../services/products/categories.service';
import { ProductService } from '../../../services';
import { BrandsService } from '../../../services/products/brands.service';
import { ClassesService } from '../../../services/products/classes.service';
import { ColorsService } from '../../../services/products/colors.service';
import { ModelsService } from '../../../services/products/models.service';
import { NgSelectModule } from '@ng-select/ng-select';

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
    SelectizeDirective,

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
  ]
})
export class SellingModule { }
