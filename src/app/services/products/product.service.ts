import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { appConfig } from '../../app.config';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class ProductService {

  private dataSource = new BehaviorSubject<any[]>([]);
  currentData= this.dataSource.asObservable();

  constructor(private http: HttpClient) { }

  changeData(data: any[]) {
    this.dataSource.next(data);
  }

  getProductInit() {
    const apiURL = `${appConfig.apiUrl}/products`;
    return this.http.get<any[]>(apiURL);
  }

}
