import { FormArray, FormGroup } from '@angular/forms';
import { ModelUser } from 'app/models/users';
import { DropDownModel } from 'app/models/drop-down-model';
import { ClStatus } from 'app/entities/ris.entities';
import { RisConfig } from '../ris.config';

export class TagClConfig extends RisConfig {
    get AlList(): FormArray {
        return this.formGroup.get('AlList') as FormArray;
    }

    get AlListIsSelect(): any[] {
        return this.AlList.value.filter(x => x.IS_CHECKED);
    }

    public bankingsDropdown: DropDownModel[];
    public reasonDropdown: DropDownModel[];
    public checkedAll: boolean;
    public mUser: ModelUser;
    public formGroup: FormGroup;
    public loading: number;
    public balancePriceState: number;
    public ClStatus = ClStatus;
}