import { FormGroup } from '@angular/forms';
import { DropDownModel } from 'app/models/drop-down-model';
import { RisConfig } from '../ris.config';
import { BehaviorSubject, Subject } from 'rxjs';
import { IUserResCookie } from 'app/interfaces/users';
import { PaymentType, PaymentTypeList } from 'app/entities/general.entities';
import { IPayment } from 'app/interfaces/payment.interface';
import { ITag } from './tag.interface';
import { IBookingCarDetail } from 'app/interfaces/sellings';

export class TagConFormConfig extends RisConfig {

    mUser: IUserResCookie;
    formGroup: FormGroup;
    dataTable: any;
    loading: number;
    reasonDropdown: DropDownModel[];

    PaymentType = PaymentType;
    PaymentTypeList = PaymentTypeList;

    $Motobike = new BehaviorSubject<IBookingCarDetail>(null);

    TagListItem$ = new BehaviorSubject<any[]>([]);
    TagHistory$ = new BehaviorSubject<any>(null);

    $CarHistoryBookingId = new Subject<number>();
    $BookingId = new Subject<number>();
    $Status1 = new BehaviorSubject<number>(null);
    $Status2 = new BehaviorSubject<number>(null);
    $SellNo = new Subject<string>();
    // $FNo = new Subject<string>();
    // $ENo = new Subject<string>();

    $Tag = new BehaviorSubject<ITag>(null);
    $HistoryCar: any = { invalid: true };
    formPayment: IPayment;
    PaymentData = new BehaviorSubject(null);

    get paymentPriceNotEqualNetprice(): boolean {
        return this.formGroup.get('netPrice1').value != this.formGroup.get('paymentPrice').value
    }

    historyCarChange(event: any) {
        this.$HistoryCar = { ...event };
        
        this.$Tag.next({
            tagNo: event.tagNo,
            tagRegis: event.tagRegis,
            tagExpire: event.tagExpire,
            province: event.province
        });
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
            tagNo: event.tagNo,
            typeName: event.typeName,
            brandName: event.brandName,
            modelName: event.modelName,
            colorName: event.colorName,
        })
    }


}