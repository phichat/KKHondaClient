import { OnInit, Component } from '@angular/core';
import { ListConItemConfig } from './list-con-item.config';
import { HttpClient } from '@angular/common/http';
import { mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-list-con-item-component',
  templateUrl: './list-con-item.component.html'
})
export class ListConItemComponent extends ListConItemConfig implements OnInit {

  constructor(
    private http: HttpClient
  ) {
    super()
  }

  ngOnInit(): void {
    this.$ConListNo.pipe(
      tap(() => this.loading = 0),
      mergeMap(x => {
        if (x == null) return of([]);
        const params = { conListNo: x };
        return this.http.get<any[]>(`${this.risUrl}/GetByConNoList`, { params });
      })
    ).subscribe(x => {
      if (!x.length) { this.loading = 1; return; }
      this.ConList = x;
    }, () => this.loading = 2);
  }
}

