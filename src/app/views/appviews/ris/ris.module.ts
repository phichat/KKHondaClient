import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagConcludeFormComponent } from './tag-conclude-form/tag-conclude-form.component';
import { TagAlFormComponent } from './tag-al-form/tag-al-form.component';
import { TagClFormComponent } from './tag-cl-form/tag-cl-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    TagConcludeFormComponent,
    TagAlFormComponent,
    TagClFormComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class RISModule { }
