import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagSedFormComponent } from './tag-sed-form/tag-sed-form.component';
import { TagAlFormComponent } from './tag-al-form/tag-al-form.component';
import { TagClFormComponent } from './tag-cl-form/tag-cl-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagAlListComponent } from './tag-al-list/tag-al-list.component';
import { TagClListComponent } from './tag-cl-list/tag-cl-list.component';
import { ListAlItemComponent } from './tag-clear-money/list-al-item.component';
import { ListDocComponent } from './tag-clear-money/list-doc.component';
import { ListConItemComponent } from './tag-clear-money/list-con-item.component';
import { ListConItemDetailComponent } from './tag-clear-money/list-con-item-detail.component';
import { TagSedListComponent } from './tag-sed-list/tag-sed-list.component';
import { TagSedFormDetailComponent } from './tag-sed-form/tag-sed-form-detail.component';
import { TagAlFormDetailComponent } from './tag-al-form/tag-al-form-detail.component';
import { TagClFormDetailComponent } from './tag-cl-form/tag-cl-form-detail.component';
import { TagHistoryCarComponent } from './tag-history-car/tag-history-car.component';
import { TagConFormComponent } from './tag-con-form/tag-con-form.component';
import { TagConFormEditComponent } from './tag-con-form/tag-con-form-edit.component';
import { TagConListComponent } from './tag-con-list/tag-con-list.component';
import { TagClearMoneyListComponent } from './tag-clear-money-list/tag-clear-money-list.component';
import { TagBookWaitingListComponent } from './tag-book-waiting-list/tag-book-waiting-list.component';
import { TagConFormDetailComponent } from './tag-con-form/tag-con-form-detail.component';
import { ListItemComponent as TagConFormListItem } from './tag-con-form/list-item.component';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { ClearMoneyCreateComponent } from './tag-clear-money/clear-money-create.component';
import { ClearMoneyDetailComponent } from './tag-clear-money/clear-money-detail.component';

@NgModule({
  declarations: [
    TagSedFormDetailComponent,
    TagSedFormComponent,
    TagSedListComponent,
    TagAlFormComponent,
    TagAlFormDetailComponent,
    TagAlListComponent,
    TagClFormComponent,
    TagClFormDetailComponent,
    TagClListComponent,
    TagHistoryCarComponent,
    TagConFormComponent,
    TagConFormEditComponent,
    TagConFormDetailComponent,
    TagConListComponent,
    TagConFormListItem,
    TagClearMoneyListComponent,
    TagBookWaitingListComponent,
    ClearMoneyCreateComponent,
    ClearMoneyDetailComponent,
    ListAlItemComponent,
    ListConItemComponent,
    ListConItemDetailComponent,
    ListDocComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MyDatePickerTHModule
  ]
})
export class RISModule { }
