import { BehaviorSubject } from 'rxjs';
import { Input, Output, EventEmitter } from '@angular/core';
import { RisConfig } from '../ris.config';
import { ISedRes, IAlRes } from 'app/interfaces/ris';

export class ListAlItemConfig extends RisConfig {
    @Input() $SedItem: BehaviorSubject<ISedRes>;
    @Output() AlOutput$ = new EventEmitter<IAlRes[]>();
    public AlList: IAlRes[] = [];
    public loading: number;
}