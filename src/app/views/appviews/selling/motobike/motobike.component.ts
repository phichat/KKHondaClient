import { Component, OnInit, OnChanges, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ProductType, ProductCategory, ProductModel, ProductBrand, ProductColor, ProductBranch } from '../../../../models/products';
import { TypesService } from '../../../../services/products/types.service';
import { CategoriesService } from '../../../../services/products/categories.service';
import { ModelsService } from '../../../../services/products/models.service';
import { BrandsService } from '../../../../services/products/brands.service';
import { ColorsService } from '../../../../services/products/colors.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ModelProduct, ModelSummary } from '../../../../models/selling';
import { ProductService } from '../../../../services';
import { UserService } from '../../../../services/users';
import { SellingService } from '../../../../services/selling';


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
  productBranch = new Array<ProductBranch>();

  modelSummary: ModelSummary;

  model = new ModelProduct;

  branchId: string;
  userId: number;

  constructor(
    private _typeService: TypesService,
    private _categoriesService: CategoriesService,
    private _modelsService: ModelsService,
    private _brandsService: BrandsService,
    private _colorsService: ColorsService,
    private _productsService: ProductService,
    private _usersSerivce: UserService,
    private _sellingService: SellingService
  ) {
    this.model.typeId = 2;   // รถครอบครัว
    this.model.catId = 4;    // รถจักรยานยนต์
    this.model.brandId = 9;   // Honda

    this.model.sellPrice = 0.00;
    this.model.sellPrice2 = 0.00;
    this.model.sellVat = 0.00;
    this.model.sellVatPrice = 0.00;
    this.model.discountPrice = 0.00;
    this.model.discountVat = 0.00;
    this.model.sellNet = 0.00;
    this.model.freePrb = true;
    this.model.freeRegister = true;
    this.model.freeInsure = true;

    this.onLoadTypes();
    this.onLoadCategories();
    this.onLoadBrands();
    this.onLoadModel();
  }

  ngOnInit() {
    this._usersSerivce.currentData.subscribe(p => {
      this.userId = p.userId;
      this.branchId = p.branchId.toString();
    });

    // this._sellingService.currentData.subscribe(p => {
    //   this.modelSummary.bookingCode = p.bookingCode;
    //   this.modelSummary.status = p.status;
    //   this.modelSummary.totalMotobike = p.totalMotobike;
    //   this.modelSummary.totalAccessory = p.totalAccessory;
    //   this.modelSummary.totalSell = p.totalSell;
    //   this.modelSummary.totalDiscount = p.totalDiscount;
    //   this.modelSummary.totalVatPrice = p.totalVatPrice;
    //   this.modelSummary.totalSellNet = p.totalSellNet;
    // })
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
        this.branchId,
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
          this.productBranch = pp.branch;

          this.model.itemId = pp.itemId;
          this.model.sellPrice = pp.sellPrice;
          this.model.sellPrice2 = pp.sellPrice2;
          this.model.sellVat = pp.sellVat;
          this.model.sellVatPrice = pp.sellVatPrice;
          this.model.discountPrice = pp.discountPrice;
          this.model.discountVat = pp.discountVat;
          this.model.sellNet = pp.sellNet;

          // this._sellingService.changeData({
          //   bookingCode: this.modelSummary.bookingCode,
          //   status: this.modelSummary.status,
          //   totalMotobike: 1,
          //   totalAccessory: this.modelSummary.totalAccessory,
          //   totalSell: pp.,
          //   totalDiscount: 0,
          //   totalVatPrice: 0,
          //   totalSellNet: 0
          // });

        });

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
    this.productBranch
      .filter(p => p.engineNo === this.model.engineNo)
      .map(p => this.model.frameNo = p.frameNo);
  }
  // ------ End On Change ------ \\

}
