
import { RisConfig } from '../ris.config';
import { FormArray, FormGroup } from '@angular/forms';
import { ModelUser } from 'app/models/users';
import { EventEmitter } from '@angular/core';
import { SedStatus } from 'app/entities/ris.entities';
import { BehaviorSubject } from 'rxjs';
import { ActionMode } from 'app/entities/general.entities';

export class ClearMoneyConfig extends RisConfig {
    public formGroup: FormGroup;
    public loading: number;
    public mUser: ModelUser;

    public sedDropDown: any[];
    public searchTypeahead = new EventEmitter<string>();
    public searchSedLoading: boolean;
    public searchSedLoadingTxt: string;
    public SedStatus = SedStatus;
    public ActionMode = ActionMode;

    public TagListItem$ = new BehaviorSubject<any[]>([]);
    public TagHistory$ = new BehaviorSubject<any>(null);

    public $ConListNo = new BehaviorSubject<string>(null);
    public $SedNo = new BehaviorSubject<string>(null);
}