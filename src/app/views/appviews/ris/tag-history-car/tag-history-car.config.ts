import { RisConfig } from '../ris.config';
import { FormGroup } from '@angular/forms';
import { Output, EventEmitter, Input } from '@angular/core';
import { EntityType, ActionMode } from 'app/entities/general.entities';
import { DropDownModel } from 'app/models/drop-down-model';
import { setLocalDate } from 'app/app.config';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ICarHistory } from 'app/interfaces/ris';
import { IBookingCarDetail } from 'app/interfaces/sellings';

export class TahHistoryConfig extends RisConfig {
    formGroup: FormGroup;
    EntityType = EntityType;
    setLocalDate = setLocalDate;
    companyDropdown: DropDownModel[];
    provinceDropdown: DropDownModel[];
    preNameDropdown: DropDownModel[];

    CustDropDown: any[];
    searchTypeahead = new EventEmitter<string>();
    searchCustLoading: boolean;
    searchCustLoadingTxt: string;

    EngineDropDown: any[];
    searchEngineLoading: boolean;
    searchEngineLoadingTxt: string;

    show = new BehaviorSubject<boolean>(false);

    onShow() {
        this.show.next(true);
    }

    onHide() {
        this.show.next(false);
    }

    @Input() $BookingId: Subject<number>;
    @Input() $ConId: Subject<number>;
    @Input() $Mode: ActionMode;
    @Input() $Motobike: Subject<IBookingCarDetail>;
    // @Input() $BookingCarDetail?: Subject<IBookingCarDetail>;
    // @Input() $ENo: Subject<string>;
    // @Input() $FNo: Subject<string>;
    // @Input() $HistoryCar: Subject<ICarHistory>;
    @Output() HistoryCar$ = new EventEmitter();

}