import { AutoCompleteModel } from 'app/models/auto-complete-model';
import { IMyDateModel } from 'mydatepicker-th';

export class ReportTopProductSpare {
    branchType: string;
    branchId: AutoCompleteModel[];

    brandType: string;
    brandTypeId: AutoCompleteModel[];
    version: AutoCompleteModel[];
    design: AutoCompleteModel[];
    color: AutoCompleteModel[];

    bookingName: string;
    bookingNameId: string;
    regisNameId: string;

    selltype: string;
    selltypeId: string;

    topRank:string;

    bookingDate: string;
    sDate: IMyDateModel;
    eDate: IMyDateModel;

    RefundbookingReceiveDate: string;
    sRefundbookingReceiveDate: IMyDateModel;
    eRefundbookingReceiveDate: IMyDateModel;
}
