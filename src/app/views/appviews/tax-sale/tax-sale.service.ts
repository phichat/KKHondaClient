import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { HttpService } from 'app/core/http.service';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/Observable';
import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { DropDownModel } from 'app/models/drop-down-model';

@Injectable()
export class TaxSaleService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  apiUrl = `Booking`

  GetBranchAutoComplete(): Observable<DropDownModel[]> {
    return this.httpService.get(`${this.apiUrl}/GetBranchAutoComplete`).pipe(map(x => x.json()))
  }

}
