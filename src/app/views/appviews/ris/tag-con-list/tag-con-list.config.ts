import { setLocalDate } from 'app/app.config';
import { ConStatus } from 'app/entities/ris.entities';
import { RisConfig } from '../ris.config';

export class TagClListConfig extends RisConfig {
    public loading: number;
    public ConStatus = ConStatus;
    public conList: any[] = [];
}