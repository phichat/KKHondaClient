import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { IExpensesOtherRisRes } from '../../interfaces/ris/expense-other.interface';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable({ providedIn: 'root' })
export class ExpenseOtherService {
  constructor(private httpClient: HttpClient) { }

  url = `${appConfig.apiUrl}/Ris/ExpensesOther`;

  GetAll() {
    return this.httpClient.get<IExpensesOtherRisRes[]>(this.url)
    .pipe(
      catchError(this.onCatch)
    );
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }
}