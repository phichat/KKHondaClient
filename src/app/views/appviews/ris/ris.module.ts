import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagConcludeFormComponent } from './tag-conclude-form/tag-conclude-form.component';
import { TagAlFormComponent } from './tag-al-form/tag-al-form.component';
import { TagClFormComponent } from './tag-cl-form/tag-cl-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagSedListComponent } from './tag-sed-list/tag-sed-list.component';
import { TagAlListComponent } from './tag-al-list/tag-al-list.component';
import { TagClListComponent } from './tag-cl-list/tag-cl-list.component';
import { ListAlComponent } from './tag-cl-form/list-al.component';
import { ListDocComponent } from './tag-cl-form/list-doc.component';
import { ListItemComponent } from './tag-cl-form/list-item.component';
import { ListItemDetailComponent } from './tag-cl-form/list-item-detail.component';
import { TagConcludeListComponent } from './tag-conclude-list/tag-conclude-list.component';
import { TagConcludeFormDetailComponent } from './tag-conclude-form/tag-conclude-form-detail.component';

@NgModule({
  declarations: [
    TagConcludeFormDetailComponent,
    TagConcludeFormComponent,
    TagConcludeListComponent,
    TagAlFormComponent,
    TagClFormComponent,
    TagSedListComponent,
    TagAlListComponent,
    TagClListComponent,
    ListAlComponent,
    ListDocComponent,
    ListItemComponent,
    ListItemDetailComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class RISModule { }
