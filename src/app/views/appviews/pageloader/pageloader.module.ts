import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageloaderComponent } from './pageloader.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PageloaderComponent],
  exports: [PageloaderComponent]
})
export class PageloaderModule { }
