import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { appConfig } from '../../app.config';
import { Observer } from 'rxjs/Observer';
import { ModelProduct } from '../../models/selling';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  FilterByKey(branchId: string, typeId: string, catId: string, brandId: string, modelId: string, colorId: string) {
    const apiURL = `${appConfig.apiUrl}/products/Products/FilterByKey`;
    const params = { branchId, typeId, catId, brandId, modelId, colorId };
    return this.http.get<ModelProduct[]>(apiURL, { params });
  }

}
