import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingComponent } from './booking.component';
import { FlotModule } from '../../../components/charts/flotChart';
import { BookingService } from './booking.service';
import { FormsModule } from '../../../../../node_modules/@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FlotModule,
    FormsModule
  ],
  declarations: [BookingComponent],
  exports: [BookingComponent],
  providers: [BookingService]
})
export class BookingModule { }
