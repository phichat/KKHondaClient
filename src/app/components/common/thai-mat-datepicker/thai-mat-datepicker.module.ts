import { NgModule, forwardRef } from '@angular/core';

import { ThaiMatDatepickerComponent } from './thai-mat-datepicker.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  exports: [ThaiMatDatepickerComponent],
  declarations: [ThaiMatDatepickerComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ThaiMatDatepickerComponent),
      multi: true
    }
  ],
})
export class ThaiMatDatepickerModule { }
