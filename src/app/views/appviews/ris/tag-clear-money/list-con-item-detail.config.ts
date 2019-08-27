import { BehaviorSubject, Observable } from 'rxjs';
import { Input } from '@angular/core';
import { RisConfig } from '../ris.config';
import { IConItemRes } from 'app/interfaces/ris';
import { FormGroup, FormArray } from '@angular/forms';
import { LoadingEntities } from 'app/entities/loading.entities';
import { ModelUser } from 'app/models/users/user';

export class ListConItemDetailConfig extends RisConfig {
    @Input() $ConNo: BehaviorSubject<string>;
    // public ConItemList: Observable<IConItemRes[]>;
    public loading: number;
    public formGroup: FormGroup;
    public LoadEnt = LoadingEntities;
    public mUser: ModelUser;

    get ConListItem(): FormArray {
        return this.formGroup.get('ConListItem') as FormArray;
    }

    get ConListItemDoc(): FormArray {
        return this.formGroup.get('ConListItemDoc') as FormArray;
    }
}