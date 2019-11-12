import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisTagComponent } from './regis-tag/regis-tag.component';
import { RegisVehicleTaxComponent } from './regis-vehicle-tax/regis-vehicle-tax.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThaiMatDatepickerModule } from 'app/components/common/thai-mat-datepicker/thai-mat-datepicker.module';

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
    ThaiMatDatepickerModule
  ]
})
export class ReportRisModule { }
