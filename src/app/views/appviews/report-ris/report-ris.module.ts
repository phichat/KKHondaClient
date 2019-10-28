import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisTagComponent } from './regis-tag/regis-tag.component';
import { RegisVehicleTaxComponent } from './regis-vehicle-tax/regis-vehicle-tax.component';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RegisTagComponent, 
    RegisVehicleTaxComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerTHModule
  ]
})
export class ReportRisModule { }
