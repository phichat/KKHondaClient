import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { IMyDateModel } from 'mydatepicker-th';

export class CommissionSale {
    branchType: string;
    branchId: AutoCompleteModel[];

    sellType: string;
    sellName: string;
    sellId: AutoCompleteModel[];

    financeType: string;
    financeName: string;
    financeId: AutoCompleteModel[];

    sellDate: string;
    sDate: IMyDateModel;
    eDate: IMyDateModel;
}
