import { BehaviorSubject } from 'rxjs';
import { Input } from '@angular/core';
import { RisConfig } from '../ris.config';

export class ListConItemConfig extends RisConfig {
    @Input() $ConListNo: BehaviorSubject<string>;
    public ConList: any = [];
    public loading: number;
}
