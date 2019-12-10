
import { setLocalDate } from 'app/app.config';
import { ClStatus, ClStatusList } from 'app/entities/ris.entities';
import { RisConfig } from '../ris.config';
import { FormGroup } from '@angular/forms';

export class TagClListConfig extends RisConfig {
    loading: number;
    ClStatus = ClStatus;
    ClStatusList = ClStatusList;
    clList: any[] = [];
    formSearch: FormGroup;
}