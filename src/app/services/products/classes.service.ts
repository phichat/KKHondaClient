import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { ProductClass } from '../../models/products';

@Injectable()
export class ClassesService {

  constructor(private http: HttpClient) { }

  getClasses() {
    const apiURL = `${appConfig.apiUrl}/Products/Classes`;
    return this.http.get<ProductClass[]>(apiURL);
  }

}
