import { Directive, ElementRef, AfterViewInit, OnInit } from '@angular/core';
declare var jQuery: any;

@Directive({
  selector: '[appFootable]'
})
export class FootableDirective implements OnInit {

  constructor(private el: ElementRef) {

  }

  ngOnInit() {
    jQuery(this.el.nativeElement).footable({
      'expandFirst': true
    });
  }
}
