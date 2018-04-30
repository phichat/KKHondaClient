import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { ProductModel } from '../../models/products';

@Injectable()
export class ModelsService {

  constructor(private http: HttpClient) { }

  getModels() {
    const apiURL = `${appConfig.apiUrl}/Products/Models`;
    return this.http.get<ProductModel[]>(apiURL);
  }

  FilterByKey(typeId: string, catId: string, brandId: string) {
    const apiURL = `${appConfig.apiUrl}/Products/Models/FilterByKey`;
    const params = {typeId, catId, brandId}
    return this.http.get<ProductModel[]>(apiURL, { params });
  }

}
