import { BehaviorSubject } from 'rxjs';
import { Input, Output } from '@angular/core';
import { RisConfig } from '../ris.config';
import { ISedRes, IConRes, IConItemOutput } from 'app/interfaces/ris';
import { FormGroup, FormArray } from '@angular/forms';

export class ListConItemConfig extends RisConfig {
    @Input() $SedItem: BehaviorSubject<ISedRes>;
    @Input() $ConItemOutput: BehaviorSubject<IConItemOutput>; 
    @Output() $ConNoOutPut = new BehaviorSubject<string>(null);
    // public ConList: IConRes[] = [];
    public loading: number;
    public formGroup: FormGroup;
    get ConList(): FormArray {
        return this.formGroup.get('ConList') as FormArray;
    }
}
