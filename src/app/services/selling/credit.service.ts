import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ModelCredit } from '../../models/selling';
import { appConfig } from '../../app.config';
import { Observable } from 'rxjs/Observable';

import { catchError, retry } from 'rxjs/operators';
import { RequestOptions } from '@angular/http';

const httpOptions = {
  headers: new HttpHeaders({
<<<<<<< HEAD
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'my-auth-token'
=======
    'Content-Type': 'application/json'
>>>>>>> f15e5778d24486981b13bccf8ba53ae822837b4b
  })
}

@Injectable()
export class CreditService {

  constructor(private http: HttpClient) { }

  insert(credit: ModelCredit) {
    const apiURL = `${appConfig.apiUrl}/Selling/Credit`;
<<<<<<< HEAD
    return this.http.post(apiURL, credit);
=======
    return this.http.post<any>(apiURL, credit, httpOptions);
    // res.subscribe(p => {
    //   console.log(p)
    // })
>>>>>>> f15e5778d24486981b13bccf8ba53ae822837b4b
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
<<<<<<< HEAD
    return 'Something bad happened; please try again later.';
=======
    // return throwError(
    //   'Something bad happened; please try again later.');
>>>>>>> f15e5778d24486981b13bccf8ba53ae822837b4b
  };

}
