import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditComponent } from './credit.component';
import { BookingService } from '../../../services/selling';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FootableDirective } from '../../../directives/footable.directive';
import { CalculateComponent } from './calculate/calculate.component';
import { ContractComponent } from './contract/contract.component';
import { KeeperComponent } from './keeper/keeper.component';
import { ContractStatusComponent } from './contract-status/contract-status.component';
import { ContractFieldComponent } from './contract-field/contract-field.component';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { UserService } from '../../../services/users';
import { SellActivityService } from '../../../services/sell-activity';
import { CalculateListComponent } from './calculate-list/calculate-list.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractFieldListComponent } from './contract-field-list/contract-field-list.component';
import { ContractStatusListComponent } from './contract-status-list/contract-status-list.component';
import { KeeperListComponent } from './keeper-list/keeper-list.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  declarations: [
    FootableDirective,
    CreditComponent,
    CalculateComponent,
    ContractComponent,
    KeeperComponent,
    ContractStatusComponent,
    ContractFieldComponent,
    CalculateListComponent,
    ContractListComponent,
    ContractFieldListComponent,
    ContractStatusListComponent,
    KeeperListComponent
  ],
  providers: [
    SellActivityService,
    BookingService,
    // CreditService,
    UserService
  ]
})
export class CreditModule { }
