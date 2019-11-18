import { FormGroup } from '@angular/forms';
import { DropDownModel } from 'app/models/drop-down-model';
import { RisConfig } from '../ris.config';
import { BehaviorSubject, Subject } from 'rxjs';
import { IUserResCookie } from 'app/interfaces/users';
import { PaymentType, PaymentTypeList } from 'app/entities/general.entities';
import { IPayment } from 'app/interfaces/payment.interface';

export class TagConFormConfig extends RisConfig {

    mUser: IUserResCookie;
    formGroup: FormGroup;
    dataTable: any;
    loading: number;
    reasonDropdown: DropDownModel[];

    PaymentType = PaymentType;
    PaymentTypeList = PaymentTypeList;

    $Car = new BehaviorSubject<any>(null);

    TagListItem$ = new BehaviorSubject<any[]>([]);
    TagHistory$ = new BehaviorSubject<any>(null);

    $CarHistoryBookingId = new Subject<number>();
    $BookingId = new Subject<number>();
    $Status1 = new BehaviorSubject<number>(null);
    $Status2 = new BehaviorSubject<number>(null);
    $FNo = new Subject<string>();
    $ENo = new Subject<string>();

    $HistoryCar: any = { invalid: true };
    formPayment: IPayment;
    PaymentData = new BehaviorSubject(null);

    get paymentPriceNotEqualNetprice(): boolean {
        return this.formGroup.get('netPrice1').value != this.formGroup.get('paymentPrice').value
    }

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