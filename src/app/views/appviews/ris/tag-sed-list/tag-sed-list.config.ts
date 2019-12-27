
import { setLocalDate } from 'app/app.config';
import { SedStatus, SedStatusList } from 'app/entities/ris.entities';
import { RisConfig } from '../ris.config';
import { FormGroup } from '@angular/forms';

export class TagSedListConfig extends RisConfig {
    public loading: number;
    public SedList: any[] = [];
    public SedStatus = SedStatus;
    SedStatusList = SedStatusList;
    formSearch: FormGroup;
}