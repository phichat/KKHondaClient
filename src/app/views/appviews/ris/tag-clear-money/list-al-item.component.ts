import { OnInit, Component } from '@angular/core';
import { ListAlItemConfig } from './list-al-item.config';
import { mergeMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { IAlRes } from 'app/interfaces/ris';
import { ClearMoneyService } from './clear-money.service';
import { AlRegisService } from 'app/services/ris';

@Component({
    selector: 'app-list-al-item-component',
    templateUrl: './list-al-item.component.html'
})
export class ListAlItemComponent extends ListAlItemConfig implements OnInit {

    constructor(
        private s_alRegis: AlRegisService
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
                return this.s_alRegis.GetBySedNo(x.sedNo);
            })
        ).subscribe((x: IAlRes[]) => {
            if (!x.length) {
                this.loading = this.LoadEnt.noRecord;
                return;
            };
            this.AlList = x;
            this.emitValue(x);
            // this.s_clearMoney.setListAlBehaviorSubject(x);
        }, () => this.loading = this.LoadEnt.error);
    }

    private emitValue(x: IAlRes[]) {
        const obj = [...x];
        this.AlOutput$.emit(obj);
    }
}