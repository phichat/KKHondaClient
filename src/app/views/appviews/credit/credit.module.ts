import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditComponent } from './credit.component';
import { SellActivityService, BookingService } from '../../../services/selling';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FootableDirective } from '../../../directives/footable.directive';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    NgSelectModule
  ],
  declarations: [
    FootableDirective,
    CreditComponent
  ],
  providers: [
    SellActivityService,
    BookingService
  ]
})
export class CreditModule { }
