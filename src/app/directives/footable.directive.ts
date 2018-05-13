import { Directive, ElementRef, AfterViewInit } from '@angular/core';
declare var jQuery: any;

@Directive({
  selector: '[appFootable]'
})
export class FootableDirective implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    jQuery(this.el.nativeElement).footable();
  }
}
