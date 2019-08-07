
import { setLocalDate } from 'app/app.config';
import { SedStatus } from 'app/entities/ris.entities';
import { RisConfig } from '../ris.config';

export class TagSedListConfig extends RisConfig {
    public loading: number;
    public SedList: any[] = [];
    public SedStatus = SedStatus;
}