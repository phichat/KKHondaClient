import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare var jQuery: any;

@Directive({
  selector: '[appSelectizeFinancial]'
})
export class SelectizeFinancialDirective implements AfterViewInit {

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    jQuery(this.el.nativeElement).selectize({
      create: false
    });
  }
}
