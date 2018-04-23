import { Directive, ElementRef, AfterViewInit } from '@angular/core';

declare var jQuery: any;

@Directive({
  selector: '[appSelectizeProductType]'
})
export class SelectizeProductTypeDirective implements AfterViewInit {

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    jQuery(this.el.nativeElement).selectize({
      create: false
    });
  }

}
