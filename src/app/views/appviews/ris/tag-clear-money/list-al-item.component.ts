import { OnInit, Component } from '@angular/core';
import { ListAlItemConfig } from './list-al-item.config';
import { mergeMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Component({
    selector: 'app-list-al-item-component',
    templateUrl: './list-al-item.component.html'
})
export class ListAlItemComponent extends ListAlItemConfig implements OnInit {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    ngOnInit(): void {
        this.$SedNo.pipe(
            tap(() => this.loading = 0),
            mergeMap(x => {
                if (x == null) return of([]);
                const params = { sedNo: x };
                return this.http.get<any[]>(`${this.risUrl}/Al/GetBySedNo`, { params });
            })
        ).subscribe(x => {
            this.AlList = x;
            this.loading = 1;
        }, () => this.loading = 2);
    }
}