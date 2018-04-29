import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { ProductBrand } from '../../models/products';

@Injectable()
export class BrandsService {

  constructor(private http: HttpClient) { }

  getBrands() {
    const apiURL = `${appConfig.apiUrl}/Products/Brands`;
    return this.http.get<ProductBrand[]>(apiURL);
  }

}
