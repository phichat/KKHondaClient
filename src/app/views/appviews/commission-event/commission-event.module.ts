import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommissionEventService } from './commission-event.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommissionEventComponent } from './commission-event.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';

@NgModule({
  declarations: [
    CommissionEventComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerTHModule,
    NgSelectModule
  ], 
  providers: [
    CommissionEventService
  ]
})
export class CommissionEventModule { }
