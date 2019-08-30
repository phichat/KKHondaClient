import { OnInit, Component } from '@angular/core';
import { ListAlItemConfig } from './list-al-item.config';
import { mergeMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { IAlRes } from 'app/interfaces/ris';
import { ClearMoneyService } from './clear-money.service';

@Component({
    selector: 'app-list-al-item-component',
    templateUrl: './list-al-item.component.html'
})
export class ListAlItemComponent extends ListAlItemConfig implements OnInit {

    constructor(
        private http: HttpClient,
        private s_clearMoney: ClearMoneyService
    ) {
        super();
    }

    ngOnInit(): void {
        this.$SedItem.pipe(
            tap(() => {
                this.loading = this.LoadEnt.loading;
                this.AlList = [];
            }),
            mergeMap(x => {
                if (x == null) return of([]);
                const params = { sedNo: x.sedNo };
                return this.http.get<IAlRes[]>(`${this.risUrl}/Al/GetBySedNo`, { params });
            })
        ).subscribe((x: IAlRes[]) => {
            if (!x.length) {
                this.loading = this.LoadEnt.noRecord;
                return;
            };
            this.AlList = x;
            // this.s_clearMoney.setListAlBehaviorSubject(x);
        }, () => this.loading = this.LoadEnt.error);
    }
}