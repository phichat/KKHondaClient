import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ProductCategory } from '../../models';

@Injectable()
export class CategoriesService {

  private dataSource = new BehaviorSubject<ProductCategory[]>([]);
  currentData = this.dataSource.asObservable();

  constructor(private http: HttpClient) { }

  changeData(data: ProductCategory[]) {
    this.dataSource.next(data);
  }

  getCategories() {
    const apiURL = `${appConfig.apiUrl}/Products/Categories`;
    return this.http.get<ProductCategory[]>(apiURL);
  }

}
