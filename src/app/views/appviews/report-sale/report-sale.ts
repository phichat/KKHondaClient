import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { IMyDateModel } from 'mydatepicker-th';

export class ReportSale {
    branchType: string;
    branchId: AutoCompleteModel[];

    brandType: string;
    brandTypeId: AutoCompleteModel[];
    version: AutoCompleteModel[];
    design: AutoCompleteModel[];
    color: AutoCompleteModel[];

    isSellName: string;
    SellId: AutoCompleteModel[];

    isPaymentType: string;
    paymentTypeId: string;

    isSellDate: string;
    sDate: IMyDateModel;
    eDate: IMyDateModel;
}