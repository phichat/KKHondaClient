
import { setLocalDate } from 'app/app.config';
import { ClStatus } from 'app/entities/ris.entities';
import { RisConfig } from '../ris.config';

export class TagClListConfig extends RisConfig {
    public loading: number;
    public ClStatus = ClStatus;
    public clList: any[] = [];
}