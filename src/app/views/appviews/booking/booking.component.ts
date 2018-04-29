import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { ModelBookingDetail, ModelMotobike, ProductBrand, ProductType, ProductCategory } from '../../../models';
import { ProductService } from '../../../services/index';
import { CategoriesService } from '../../../services/products/categories.service';
import { TypesService } from '../../../services/products/types.service';

declare var jQuery: any;

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  // styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, AfterViewInit, OnChanges {

  isSubmit: boolean;

  @ViewChild('types') selectTypes: ElementRef;
  @ViewChild('categories') selectCategories: ElementRef;

  // Models
  modelBooking = new ModelBookingDetail();
  modelMotobike = new Array<ModelMotobike>();
  productBrand = new Array<ProductBrand>();
  productTypes = new Array<ProductType>();
  productCategories = new Array<ProductCategory>();

  constructor(
    private _productService: ProductService,
    private _typesSertive: TypesService,
    private _categoriesServices: CategoriesService
  ) {
    this.isSubmit = false;

    this.modelBooking.bookingCode = 'New';
    this.modelBooking.mbAmnt = 0.00;
    this.modelBooking.itemAmnt = 0.00;
    this.modelBooking.totalSell = 0.00;
    this.modelBooking.totalDiscount = 0.00;
    this.modelBooking.totalVat = 0.00;
    this.modelBooking.totalSellNet = 0.00;

    // this._productService.getProductInit().subscribe(prop => {
    //   this._productService.changeData(prop);
    // });

  }

  ngOnInit() {
    // this._typesSertive.currentData.subscribe(p => {
    //   if (p.length) {
    //     this.productTypes = p;
    //   }
    // });

    // this._categoriesServices.currentData.subscribe(p => {
    //   if (p.length) {
    //     this.productCategories = p;
    //   }
    // });
  }

  ngAfterViewInit() {


  }

  ngOnChanges() {
    if (jQuery(this.selectTypes).find('.selectized').length){

    }
  }



  onSubmit() {
    this.isSubmit = true;
  }

}
