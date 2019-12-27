
import { setLocalDate } from 'app/app.config';
import { RisConfig } from '../ris.config';
import { BookingPaymentType, BookingPaymentTypeList } from 'app/entities/mcs.entities';
import { FormGroup, FormArray } from '@angular/forms';

export class TagBookWaitingListListConfig extends RisConfig {
    public loading: number;
    public formSearch: FormGroup;
    public waitingList: any[] = [];
    public BookingPaymentType = BookingPaymentType;
    BookingPaymentTypeList = BookingPaymentTypeList;

    get bookingPaymentType(): FormArray {
        return this.formSearch.get('bookingPaymentType') as FormArray;
    }
}