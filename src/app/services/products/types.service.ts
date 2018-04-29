import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { appConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { ProductType } from '../../models/products';

@Injectable()
export class TypesService {

  private dataSource = new BehaviorSubject<ProductType[]>([]);
  currentData = this.dataSource.asObservable();

  constructor(private http: HttpClient) { }

  changeData(data: ProductType[]) {
    this.dataSource.next(data);
  }

  getTypes() {
    const apiURL = `${appConfig.apiUrl}/Products/Types`;
    return this.http.get<ProductType[]>(apiURL);
  }

}