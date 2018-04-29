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

}
