import { Directive, ElementRef, AfterViewInit } from '@angular/core';

declare var jQuery: any;

@Directive({
  selector: '[appSelectizeProductModel]'
})
export class SelectizeProductModelDirective implements AfterViewInit {

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    jQuery(this.el.nativeElement).selectize({
      create: false
    });
  }
}
