import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ModelCredit } from '../../models/selling';
import { appConfig } from '../../app.config';
import { Observable } from 'rxjs/Observable';

import { catchError, retry } from 'rxjs/operators';
import { RequestOptions } from '@angular/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable()
export class CreditService {

  constructor(private http: HttpClient) { }

  insert(credit: ModelCredit) {
    const apiURL = `${appConfig.apiUrl}/Selling/Credit`;
    return this.http.post(apiURL, credit);
  }

  // insert(hero: ModelCredit): Observable<Hero> {
  //   return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
  //     .pipe(
  //       catchError(this.handleError('addHero', hero))
  //     );
  // }

}
