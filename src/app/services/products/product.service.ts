import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { ProductMc } from 'app/models/products';

@Injectable({providedIn: 'root'})
export class ProductService {

  constructor(private http: HttpClient) { }

  url = `${appConfig.apiUrl}/Products`;

  // FilterByKey(branchId: string, typeId: string, catId: string, brandId: string, modelId: string, colorId: string) {
  //   const apiURL = `${appConfig.apiUrl}/products/Products/FilterByKey`;
  //   const params = { branchId, typeId, catId, brandId, modelId, colorId };
  //   return this.http.get<ModelProduct[]>(apiURL, { params });
  // }

  GetMCByKeyword(term: string) {
    const params = { term };
    const url = `${this.url}/GetMCByKeyword`;
    return this.http.get<ProductMc[]>(url, { params });
  }


}

