import { Directive, ElementRef, AfterViewInit, OnInit } from '@angular/core';
declare var jQuery: any;

@Directive({
  selector: '[appInputmask]'
})
export class InputmaskDirective implements OnInit {

  constructor(private el: ElementRef) {

  }

  ngOnInit() {
    jQuery(this.el.nativeElement).inputmask({
      'alias': 'numeric',
      'groupSeparator': ',',
      'autoGroup': true,
      'digits': 2,
      'digitsOptional': false,
      'placeholder': '0.00'
    });
  }

}
