import { OnInit, Component } from '@angular/core';
import { ListConItemConfig } from './list-con-item.config';
import { HttpClient } from '@angular/common/http';
import { mergeMap, tap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { IConRes } from 'app/interfaces/ris';

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
    this.$SedItem.pipe(
      tap(() => this.loading = 0),
      mergeMap(x => {
        if (x == null) return of([]);
        const params = { conListNo: x.conList };
        return this.http.get<IConRes[]>(`${this.risUrl}/GetByConNoList`, { params })
          .pipe(
            map(o => o.reduce((a, c) => [...a, { ...c, sedNo: x.sedNo }], []))
          );
      })
    ).subscribe((x: IConRes[]) => {
      if (!x.length) { this.loading = 1; return; }
      this.ConList = x;
    }, () => this.loading = 2);
  }

  selectCon(conNo: string) {
    this.$ConNoOutPut.next(conNo);
  }
}

