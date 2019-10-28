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
import { ClearMoneyService } from './tag-clear-money/clear-money.service';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { services as RisService } from 'app/services/ris';


@NgModule({
  declarations: [
    TagSedListComponent,
    TagAlListComponent,
    TagClListComponent,
    TagConListComponent,
    TagBookWaitingListComponent,
    TagClearMoneyListComponent,
    ...TagAlForm,
    ...TagClForm,
    ...TagSedForm,
    ...TagHistoryCar,
    ...TagConForm,
    ...TagClearMoney
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MyDatePickerTHModule
  ],
  providers: [
    ClearMoneyService,
    ...RisService
  ]
})
export class RISModule { }
