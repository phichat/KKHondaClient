import { RisConfig } from '../ris.config';
import { FormGroup } from '@angular/forms';
import { ConStatus1List, ConStatus2List } from 'app/entities/ris.entities';

export class TagClListConfig extends RisConfig {
    public loading: number;
    public conList: any[] = [];
    formSearch: FormGroup;
    ConStatus1List = ConStatus1List;
    ConStatus2List = ConStatus2List;
}