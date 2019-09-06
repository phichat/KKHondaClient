import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { IMyDateModel } from 'mydatepicker-th';

export class ReportCreditNote {
    branchType: string;
    branchId: AutoCompleteModel[];

    bookingName: string;
    bookingNameId: string;
    regisNameId: string;

    bookingDate: string;
    sDate: IMyDateModel;
    eDate: IMyDateModel;
}