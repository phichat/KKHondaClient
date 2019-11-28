import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { IMyDateModel } from 'mydatepicker-th';

export class TaxPurchase {
    branchType: string;
    branchId: AutoCompleteModel[];

    reportType: string;

    dateType: string;
    dateMonthYear: IMyDateModel;
    dateMonth: string;
    dateYear: string;
    sDate: IMyDateModel;
    eDate: IMyDateModel;
}
