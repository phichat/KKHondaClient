import { Directive, ElementRef, AfterViewInit, OnChanges, OnInit } from '@angular/core';
import { ProductService } from '../services';
import { appConfig } from '../app.config';
import { TypesService } from '../services/products/types.service';

declare var jQuery: any;

@Directive({
  selector: '[appSelectizeProductType]'
})
export class SelectizeProductTypeDirective implements OnInit, OnChanges {

  constructor(
    private el: ElementRef,
    private _TypesSertice: TypesService
  ) {
  }

  ngOnInit() {
    this._TypesSertice.getTypes().subscribe(p => {
      this._TypesSertice.changeData(p);
    });
  }

  ngOnChanges() {
    if (jQuery(this.el.nativeElement).find('.selectized').length === 0) {
      jQuery(this.el.nativeElement).selectize({
        create: false
      });
    }
  }

}
