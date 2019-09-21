import { TagConFormConfig } from './tag-con-form.config';
import { FormGroup, FormArray } from '@angular/forms';
import { Output, Input, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionMode } from 'app/entities/general.entities';
import { DropDownModel } from 'app/models/drop-down-model';

export class ListItemConfig extends TagConFormConfig {
    public formGroup: FormGroup;
    public formCarHistory: FormGroup;
    public formExpenses: FormGroup;
    public expenses: any[] = [];
    public loading: number;
    public provinceDropdown: DropDownModel[];
    public insureDropdown: DropDownModel[];

    get CarRegisListItem(): FormArray {
        return this.formGroup.get('carRegisListItem') as FormArray;
    }

    public _IsTagItem: boolean = true;
    get IsTagItem(): boolean {
        return this._IsTagItem;
    }

    public _IsActItem: boolean = true;
    get IsActItem(): boolean {
        return this._IsActItem;
    }

    public _IsWarItem: boolean = true;
    get IsWarItem(): boolean {
        return this._IsWarItem;
    }

    disableNotEqualSale: boolean;
    disableNotEqualRis: boolean;

    @Input() BookingId?: BehaviorSubject<number>;
    @Input() BookingStatus?: BehaviorSubject<number>;
    @Input() Car?: BehaviorSubject<any>;
    @Input() Mode: ActionMode;
    @Output() TagListItem = new EventEmitter<any[]>();
    @Output() TagHistory = new EventEmitter<any[]>();
}