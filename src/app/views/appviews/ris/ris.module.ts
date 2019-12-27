import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagAlListComponent } from './tag-al-list/tag-al-list.component';
import { TagClListComponent } from './tag-cl-list/tag-cl-list.component';
import { TagSedListComponent } from './tag-sed-list/tag-sed-list.component';
import { TagConListComponent } from './tag-con-list/tag-con-list.component';
import { TagBookWaitingListComponent } from './tag-book-waiting-list/tag-book-waiting-list.component';
import { TagClearMoneyListComponent } from './tag-clear-money-list/tag-clear-money-list.component';
import { components as TagAlForm } from './tag-al-form';
import { components as TagClForm } from './tag-cl-form';
import { components as TagSedForm } from './tag-sed-form';
import { components as TagHistoryCar } from './tag-history-car';
import { components as TagConForm } from './tag-con-form';
import { components as TagClearMoney } from './tag-clear-money';
import { components as ReceiveDeposit } from './receive-deposit-form';
import { ClearMoneyService } from './tag-clear-money/clear-money.service';
import { services as RisService } from 'app/services/ris';
import { ReceiveDepositListComponent } from './receive-deposit-list/receive-deposit-list.component';
import { PaymentTypeModule } from 'app/views/components/payment-type/payment-type.module';
import { ThaiMatDatepickerModule } from 'app/components/common/thai-mat-datepicker/thai-mat-datepicker.module';


@NgModule({
  declarations: [
    TagSedListComponent,
    TagAlListComponent,
    TagClListComponent,
    TagConListComponent,
    TagBookWaitingListComponent,
    TagClearMoneyListComponent,
    ReceiveDepositListComponent,
    ...TagAlForm,
    ...TagClForm,
    ...TagSedForm,
    ...TagHistoryCar,
    ...TagConForm,
    ...TagClearMoney,
    ...ReceiveDeposit
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    PaymentTypeModule,

    ThaiMatDatepickerModule
  ],
  providers: [
    ClearMoneyService,
    ...RisService
  ]
})
export class RISModule { }
