import { FormArray, FormGroup } from '@angular/forms';
import { ModelUser } from 'app/models/users';
import { DropDownModel } from 'app/models/drop-down-model';
import { AlStatus } from 'app/entities/ris.entities';
import { RisConfig } from '../ris.config';

export class TagAlListConfig extends RisConfig {
    get SedList(): FormArray {
        return this.formGroup.get('SedList') as FormArray;
    }

    get SedListIsSelect(): any[] {
        return this.SedList.value.filter(x => x.IS_CHECKED);
    }

    public bankingsDropdown: DropDownModel[];
    public checkedAll: boolean;
    public mUser: ModelUser;
    public formGroup: FormGroup;
    public loading: number;
    public AlStatus = AlStatus;
}