import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisTagComponent } from './regis-tag/regis-tag.component';
import { RegisVehicleTaxComponent } from './regis-vehicle-tax/regis-vehicle-tax.component';
import { MyDatePickerTHModule } from 'mydatepicker-th';

@NgModule({
  declarations: [RegisTagComponent, RegisVehicleTaxComponent],
  imports: [
    CommonModule,
    MyDatePickerTHModule
  ]
})
export class ReportRisModule { }
