import { Component, OnInit, OnChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ProductType, ProductCategory, ProductModel, ProductBrand, ProductColor } from '../../../../models/products';
import { TypesService } from '../../../../services/products/types.service';
import { CategoriesService } from '../../../../services/products/categories.service';
import { ModelsService } from '../../../../services/products/models.service';
import { BrandsService } from '../../../../services/products/brands.service';
import { ColorsService } from '../../../../services/products/colors.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

declare var jQuery: any;
declare var selectize: any;

@Component({
  selector: 'app-motobike',
  templateUrl: './motobike.component.html',
  styleUrls: ['./motobike.component.scss']
})
export class MotobikeComponent implements OnInit {

  productTypes = new Array<ProductType>();
  productCategories = new Array<ProductCategory>();
  productModel = new Array<ProductModel>();
  productBrand = new Array<ProductBrand>();
  productColor = new Array<ProductColor>();

  selectedCity: any;

  cities = [
    {id: 1, name: 'Vilnius'},
    {id: 2, name: 'Kaunas'},
    {id: 3, name: 'Pavilnys', disabled: true},
    {id: 4, name: 'Pabradė'},
    {id: 5, name: 'Klaipėda'}
];


  constructor(
    private _typeService: TypesService,
    private _categoriesService: CategoriesService,
    private _modelsService: ModelsService,
    private _brandsService: BrandsService,
    private _productColor: ColorsService
  ) {
    this._typeService.getTypes().subscribe(p => {
      this.productTypes = p;
      console.log(this.productTypes.map(v => v.typeName))
    });

    this._categoriesService.getCategories().subscribe(p => {
      this.productCategories = p;
    });

    this._modelsService.getModels().subscribe(p => {
      this.productModel = p;
    });

    this._brandsService.getBrands().subscribe(p => {
      this.productBrand = p;
    });

    this._productColor.getColors().subscribe(p => {
      this.productColor = p;
    });
  }

  ngOnInit() {

  }

}
