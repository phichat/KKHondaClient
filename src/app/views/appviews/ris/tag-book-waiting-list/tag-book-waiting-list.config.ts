
import { setLocalDate } from 'app/app.config';
import { RisConfig } from '../ris.config';
import { BookingPaymentType } from 'app/entities/mcs.entities';

export class TagBookWaitingListListConfig extends RisConfig {
    public loading: number;
    public waitingList: any[] = [];
    public BookingPaymentType = BookingPaymentType;
}