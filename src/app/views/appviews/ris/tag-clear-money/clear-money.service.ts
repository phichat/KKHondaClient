import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICon, IConItemDocRes, IConItemRes, IAlRes, IConRes } from 'app/interfaces/ris';

@Injectable()
export class ClearMoneyService {

    constructor() { }

    private clearMoneyBehaviorSubject = new BehaviorSubject<any>(null);
    private listConBehaviorSubject = new BehaviorSubject<IConRes[]>([]);
    private listConItemBehaviorSubject = new BehaviorSubject<IConItemRes[]>([]);
    private listAlBehaviorSubject = new BehaviorSubject<IAlRes[]>([]);
    private listConItemDocBehaviorSubject = new BehaviorSubject<IConItemDocRes[]>([]);

    public setClearMoneyBehaviorSubject(value: any) {
        this.clearMoneyBehaviorSubject.next(value);
    }
    get ClearMoney(): any {
        return this.clearMoneyBehaviorSubject.getValue();
    }

    // public clearListConBehaviorSubject = () => this.listConBehaviorSubject.next([]);

    // public setListConBehaviorSubject(value: IConRes[]) {
    //     const item = [...this.listConBehaviorSubject.getValue(), ...value]
    //     this.listConBehaviorSubject.next(item)
    // };
    // get ListCon(): IConRes[] {
    //     return this.listConBehaviorSubject.getValue();
    // }

    public clearListConItemBehaviorSubject = () => this.listConItemBehaviorSubject.next([]);

    public setListConItemBehaviorSubject(value: IConItemRes[]) {
        if (!value.length) return;
        const copyItem = this.listConItemBehaviorSubject.getValue()
        let item = [];
        if (copyItem.length == 0) {
            item = value;
        } else {
            const bookingNo = value[0]['bookingNo'];
            const count = copyItem.filter(x => x.bookingNo == bookingNo).length;
            item = count > 0
                ? copyItem.map(x => {
                    // const i = value.findIndex(o => o.bookingId == x.bookingId && o.runId == x.runId);
                    const res = value.find(o => o.bookingNo == x.bookingNo && o.runId == x.runId);
                    return res ? res : x;
                }) : [...copyItem, ...value];
        }
        this.listConItemBehaviorSubject.next(item);
    }
    get ListConItem(): IConItemRes[] {
        return this.listConItemBehaviorSubject.getValue();
    }

    public setListAlBehaviorSubject(value: IAlRes[]) {
        const item = [...this.listAlBehaviorSubject.getValue(), ...value];
        this.listAlBehaviorSubject.next(item);
    }
    get ListAl(): IAlRes[] {
        return this.listAlBehaviorSubject.getValue();
    }

    public clearListConItemDocBehaviorSubject = () => this.listConItemDocBehaviorSubject.next([]);

    public setListConItemDocBehaviorSubject(value: IConItemDocRes[]) {
        if (!value.length) return;
        const copyItem = this.listConItemDocBehaviorSubject.getValue()
        let item = [];
        if (copyItem.length == 0) {
            item = value
        } else {
            const bookingNo = value[0]['bookingNo'];
            const count = copyItem.filter(x => x.bookingNo == bookingNo).length;
            item = count > 0
                ? copyItem.map(x => {
                    const res = value.find(o => o.bookingNo == x.bookingNo && o.sendBackCode == x.sendBackCode);
                    return res ? res : x;
                })
                : [...copyItem, ...value];
        };
        this.listConItemDocBehaviorSubject.next(item);
    }
    get ListConItemDoc(): IConItemDocRes[] {
        return this.listConItemDocBehaviorSubject.getValue();
    }
}