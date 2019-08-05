
import { setLocalDate } from 'app/app.config';
import { ClStatus } from 'app/entities/ris.entities';

export class TagClListConfig {

    public displayLocalDate = setLocalDate;
    public dataTable: any;
    public loading: number;
    public ClStatus = ClStatus;
    public clList: any[] = [];
    
    // public outStandingBalanceState: number;
    // public borrowMoneyState: number;
}