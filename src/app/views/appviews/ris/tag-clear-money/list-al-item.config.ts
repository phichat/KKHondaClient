import { BehaviorSubject } from 'rxjs';
import { Input } from '@angular/core';
import { RisConfig } from '../ris.config';

export class ListAlItemConfig extends RisConfig {
    @Input() $SedNo: BehaviorSubject<string>;
    public AlList: any[] = [];
    public loading: number;
}