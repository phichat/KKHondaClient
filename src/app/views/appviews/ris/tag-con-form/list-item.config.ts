import { TagConFormConfig } from './tag-con-form.config';
import { FormGroup, FormArray } from '@angular/forms';
import { Output, Input, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class ListItemConfig extends TagConFormConfig {
    public formGroup:FormGroup;
    public formCarHistory: FormGroup;
    public formExpenses: FormGroup;
    public expenses: any[] = [];
    public loading: number;
    
    get CarRegisListItem(): FormArray {
        return this.formGroup.get('carRegisListItem') as FormArray;
    }

    @Input() BookingId: number; 
    @Input() Car: BehaviorSubject<any>;
    @Output() TagListItem = new EventEmitter<any[]>();
    @Output() TagHistory = new EventEmitter<any[]>();
}