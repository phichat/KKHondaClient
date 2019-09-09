
import { RisConfig } from '../ris.config';
import { FormGroup } from '@angular/forms';
import { ModelUser } from 'app/models/users';
import { EventEmitter } from '@angular/core';
import { SedStatus, RevStatus } from 'app/entities/ris.entities';
import { BehaviorSubject } from 'rxjs';
import { ActionMode } from 'app/entities/general.entities';
import { ISedRes, IConItemOutput, IConRes, IAlRes } from 'app/interfaces/ris';
import { DropDownModel } from 'app/models/drop-down-model';

export class ClearMoneyConfig extends RisConfig {
    public formGroup: FormGroup;
    public loading: number;
    public mUser: ModelUser;

    public mode: number;
    public code: string;
    public reasonDropdown: DropDownModel[];

    public clReceivePriceState: number;

    public sedDropDown: any[];
    public searchTypeahead = new EventEmitter<string>();
    public searchSedLoading: boolean;
    public searchSedLoadingTxt: string;
    public RevStatus = RevStatus;
    public SedStatus = SedStatus;
    public ActionMode = ActionMode;

    public TagListItem$ = new BehaviorSubject<any[]>([]);
    public TagHistory$ = new BehaviorSubject<any>(null);

    public $SedItem = new BehaviorSubject<ISedRes>(null);
    public $ConItemOutput = new BehaviorSubject<IConItemOutput>(null);
    public $ConNo = new BehaviorSubject<string>(null);
    public ConResOutput$ = new BehaviorSubject<IConRes[]>([]);
    public AlOutput$ = new BehaviorSubject<IAlRes[]>([]);
}