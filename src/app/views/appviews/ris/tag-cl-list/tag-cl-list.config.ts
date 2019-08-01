
import { setLocalDate } from 'app/app.config';

export class TagClListConfig {

    public displayLocalDate = setLocalDate;
    public dataTable: any;
    public loading: number;

    public clList: any[] = [];
    
    // public outStandingBalanceState: number;
    // public borrowMoneyState: number;
}