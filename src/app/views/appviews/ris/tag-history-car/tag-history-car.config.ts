import { RisConfig } from '../ris.config';
import { FormGroup } from '@angular/forms';
import { Output, EventEmitter, Input } from '@angular/core';
import { EntityType, ActionMode } from 'app/entities/general.entities';
import { DropDownModel } from 'app/models/drop-down-model';
import { setLocalDate } from 'app/app.config';
import { Subject } from 'rxjs';

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

    @Input() $BookingId: Subject<number>;
    @Input() $Mode: ActionMode;
    @Input() $ENo: Subject<string>;
    @Input() $FNo: Subject<string>;
    @Output() HistoryCar$ = new EventEmitter();

}