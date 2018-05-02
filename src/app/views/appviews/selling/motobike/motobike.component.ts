import { Component, OnInit, OnChanges, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ProductType, ProductCategory, ProductModel, ProductBrand, ProductColor, ProductQuantity } from '../../../../models/products';
import { TypesService } from '../../../../services/products/types.service';
import { CategoriesService } from '../../../../services/products/categories.service';
import { ModelsService } from '../../../../services/products/models.service';
import { BrandsService } from '../../../../services/products/brands.service';
import { ColorsService } from '../../../../services/products/colors.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ModelProduct } from '../../../../models/selling';
import { ProductService } from '../../../../services';


@Component({
  selector: 'app-motobike',
  templateUrl: './motobike.component.html',
  styleUrls: ['./motobike.component.scss']
})
export class MotobikeComponent implements OnInit, OnChanges {

  private productTypes = new Array<ProductType>();
  private productCategories = new Array<ProductCategory>();
  private productModel = new Array<ProductModel>();
  private productBrand = new Array<ProductBrand>();
  private productColor = new Array<ProductColor>();
  private productQty = new Array<ProductQuantity>();

  model = new ModelProduct;

  constructor(
    private _typeService: TypesService,
    private _categoriesService: CategoriesService,
    private _modelsService: ModelsService,
    private _brandsService: BrandsService,
    private _colorsService: ColorsService,
    private _productsService: ProductService
  ) {
    this.model.typeId = 2;   // รถครอบครัว
    this.model.catId = 4;    // รถจักรยานยนต์
    this.model.brandId = 9;   // Honda

    this.onLoadTypes();
    this.onLoadCategories();
    this.onLoadBrands();
    this.onLoadModel();
  }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  // ------ On Load ------ \\
  private onLoadTypes() {
    this._typeService
      .getTypes()
      .subscribe(p => this.productTypes = p);
  }

  private onLoadCategories() {
    this._categoriesService
      .getCategories()
      .subscribe(p => this.productCategories = p);
  }

  private onLoadBrands() {
    this._brandsService
      .getBrands()
      .subscribe(p => this.productBrand = p);
  }

  private onLoadModel() {
    this.model.modelId = null;
    this._modelsService
      .FilterByKey(
        this.model.typeId.toString(),
        this.model.catId.toString(),
        this.model.brandId.toString())
      .subscribe(p => this.productModel = p);
  }

  private onLoadColor() {
    this.model.colorId = null;
    this._colorsService
      .FilterByKey(this.model.modelId.toString())
      .subscribe(p => this.productColor = p);
  }

  private onLoadProduct() {
    this._productsService
      .FilterByKey(
        this.model.typeId.toString(),
        this.model.catId.toString(),
        this.model.brandId.toString(),
        this.model.modelId.toString(),
        this.model.colorId.toString())
      .subscribe(p => {
        if (!p) {
          return false;
        }

        p.map(pp => {
          this.productQty = pp.quantity;

          this.model.sellPrice = pp.sellPrice;
          this.model.sellPrice2 = pp.sellPrice2;
          this.model.sellVat = pp.sellVat;
          this.model.sellVatPrice = pp.sellVatPrice;
          this.model.discountPrice = pp.discountPrice;
          this.model.discountVat = pp.discountVat;
          this.model.sellNet = pp.sellNet;
          this.model.freePrb = true;
          this.model.freeRegister = true;
          this.model.freeInsure = true;
        })
      });
  }
  // ------ End On Load ------ \\


  // ------ On Change ------ \\
  private onChangeBrand() {
    this.onLoadModel();
  }

  private onChangeModel() {
    this.onLoadColor();
  }

  private onChangeColor() {
    this.onLoadProduct();
  }

  private onChangeEngine() {
    this.productQty
      .filter(p => p.engineNo === this.model.engineNo)
      .map(p => this.model.frameNo = p.frameNo);
  }
  // ------ End On Change ------ \\

}
