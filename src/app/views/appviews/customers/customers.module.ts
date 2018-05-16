import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuarantorComponent } from './guarantor/guarantor.component';
import { HirerComponent } from './hirer/hirer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [GuarantorComponent, HirerComponent]
})
export class CustomersModule { }
