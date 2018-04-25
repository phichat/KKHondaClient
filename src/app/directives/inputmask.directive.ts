import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appInputmask]'
})
export class InputmaskDirective {

  constructor(private el: ElementRef) { 
    
  }

  
}
