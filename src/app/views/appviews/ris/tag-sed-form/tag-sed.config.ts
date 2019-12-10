import { FormArray, FormGroup } from '@angular/forms';
import { ModelUser } from 'app/models/users';
import { SedStatus } from 'app/entities/ris.entities';
import { DropDownModel } from 'app/models/drop-down-model';
import { RisConfig } from '../ris.config';
import { IUserResCookie } from 'app/interfaces/users';

export class TagSedConfig extends RisConfig {
    get ConList(): FormArray {
        return this.formGroup.get('conList') as FormArray;
    }

    get ConListIsSelect(): any[] {
        return this.ConList.value.filter(x => x.IS_CHECKED);
    }

    public checkedAll: boolean;
    public mUser: IUserResCookie;
    public formGroup: FormGroup;
    public dataTable: any;
    public loading: number;
    public reasonDropdown: DropDownModel[];

    public SedStatus = SedStatus;
}