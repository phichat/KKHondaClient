import { FormGroup } from '@angular/forms';
import { DropDownModel } from 'app/models/drop-down-model';
import { RisConfig } from '../ris.config';
import { BehaviorSubject, Subject } from 'rxjs';
import { IUserResCookie } from 'app/interfaces/users';

export class TagConFormConfig extends RisConfig {

    mUser: IUserResCookie;
    formGroup: FormGroup;
    dataTable: any;
    loading: number;
    reasonDropdown: DropDownModel[];

    $Car = new BehaviorSubject<any>(null);

    TagListItem$ = new BehaviorSubject<any[]>([]);
    TagHistory$ = new BehaviorSubject<any>(null);

    $CarHistoryBookingId = new Subject<number>();
    $BookingId = new Subject<number>();
    $Status1 = new BehaviorSubject<number>(null);
    $Status2 = new Subject<number>();
    $FNo = new Subject<string>();
    $ENo = new Subject<string>();

    $HistoryCar: any = { invalid: true };

    historyCarChange(event: any) {
        this.$HistoryCar = { ...event };
    }

    confirmHistory() {
        const event = this.$HistoryCar;
        this.formGroup.patchValue({
            eNo: event.eNo,
            fNo: event.fNo,
            ownerCode: event.ownerCode,
            ownerName: event.ownerName,
            visitorCode: event.visitorCode,
            visitorName: event.visitorName,
            province: event.province,
            tagNo: event.tagNo
        })
    }


}