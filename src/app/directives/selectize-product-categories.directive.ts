import { Directive, ElementRef, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { CategoriesService } from '../services/products/categories.service';
declare var jQuery: any;

@Directive({
  selector: '[appSelectizeProductCategories]'
})
export class SelectizeProductCategoriesDirective implements OnInit, OnChanges {

  constructor(
    private el: ElementRef,
    private _CategoriesSertice: CategoriesService
  ) {
  }

  ngOnInit() {
    this._CategoriesSertice.getCategories().subscribe(p => {
      this._CategoriesSertice.changeData(p);
    });
  }

  ngOnChanges() {
    if (jQuery(this.el.nativeElement).find('.selectized').length) {
      jQuery(this.el.nativeElement).selectize({
        create: false
      });
    }
  }

}
