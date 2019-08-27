import { OnInit, Component } from '@angular/core';
import { ListAlItemConfig } from './list-al-item.config';
import { mergeMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { IAlRes } from 'app/interfaces/ris';

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
        this.$SedItem.pipe(
            tap(() => this.loading = 0),
            mergeMap(x => {
                if (x == null) return of([]);
                const params = { sedNo: x.sedNo };
                return this.http.get<IAlRes[]>(`${this.risUrl}/Al/GetBySedNo`, { params });
            })
        ).subscribe((x:IAlRes[]) => {
            this.AlList = x;
            this.loading = 1;
        }, () => this.loading = 2);
    }
}