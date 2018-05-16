import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare var jQuery: any;

@Directive({
  selector: '[appSelectizeProductAccessory]'
})
export class SelectizeProductAccessoryDirective implements AfterViewInit {

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    jQuery(this.el.nativeElement).selectize({
      create: false
    });
  }
}
