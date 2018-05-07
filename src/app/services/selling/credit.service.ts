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
    // res.subscribe(p => {
    //   console.log(p)
    // })
  }

  extractData(res: Response) {
    const body = res.body;
    return body || {};
  }
  handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    // return throwError(
    //   'Something bad happened; please try again later.');
  };

}
