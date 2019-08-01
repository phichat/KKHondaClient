
import { setLocalDate } from 'app/app.config';
import { SedStatus } from 'app/entities/ris.entities';

export class TagConcludeListConfig {

    public displayLocalDate = setLocalDate;
    public dataTable: any;
    public loading: number;
    public SedList: any[] = [];
    public SedStatus = SedStatus;
}