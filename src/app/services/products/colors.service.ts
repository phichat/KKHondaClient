import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { ProductColor } from '../../models/products';

@Injectable()
export class ColorsService {

  constructor(private http: HttpClient) { }

  getColors() {
    const apiURL = `${appConfig.apiUrl}/Products/Colors`;
    return this.http.get<ProductColor[]>(apiURL);
  }

  FilterByKey(modelId: string) {
    const apiURL = `${appConfig.apiUrl}/Products/Colors/FilterByKey`;
    const params = { modelId }
    return this.http.get<ProductColor[]>(apiURL, { params });
  }

}
