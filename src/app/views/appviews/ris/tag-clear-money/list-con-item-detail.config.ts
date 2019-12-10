import { BehaviorSubject, Observable } from 'rxjs';
import { Input, Output, EventEmitter } from '@angular/core';
import { RisConfig } from '../ris.config';
import { IConItemRes, IConItemOutput } from 'app/interfaces/ris';
import { FormGroup, FormArray } from '@angular/forms';
import { LoadingEntities } from 'app/entities/loading.entities';
import { ModelUser } from 'app/models/users/user';
import { IUserResCookie } from 'app/interfaces/users';

export class ListConItemDetailConfig extends RisConfig {
    @Input() $ConNo: BehaviorSubject<string>;
    @Output() ConItemOutput$ = new EventEmitter<IConItemOutput>(null);
    @Input() $Mode: number;
    // public ConItemList: Observable<IConItemRes[]>;
    public loading: number;
    public formGroup: FormGroup;
    public mUser: IUserResCookie;

    get ConListItem(): FormArray {
        return this.formGroup.get('ConListItem') as FormArray;
    }

    get ConListItemDoc(): FormArray {
        return this.formGroup.get('ConListItemDoc') as FormArray;
    }
}