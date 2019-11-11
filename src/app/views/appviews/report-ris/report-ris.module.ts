import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisTagComponent } from './regis-tag/regis-tag.component';
import { RegisVehicleTaxComponent } from './regis-vehicle-tax/regis-vehicle-tax.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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

    MatNativeDateModule,
    MatDatepickerModule
  ]
})
export class ReportRisModule { }
