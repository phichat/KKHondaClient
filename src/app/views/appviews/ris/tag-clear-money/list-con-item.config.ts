import { BehaviorSubject } from 'rxjs';
import { Input, Output } from '@angular/core';
import { RisConfig } from '../ris.config';
import { ISedRes, IConRes } from 'app/interfaces/ris';

export class ListConItemConfig extends RisConfig {
    @Input() $SedItem: BehaviorSubject<ISedRes>;
    @Output() $ConNoOutPut = new BehaviorSubject<string>(null);
    public ConList: IConRes[] = [];
    public loading: number;
}
