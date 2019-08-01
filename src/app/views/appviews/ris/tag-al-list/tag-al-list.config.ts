import { FormArray, FormGroup } from '@angular/forms';
import { ModelUser } from 'app/models/users';
import { setLocalDate } from 'app/app.config';
import { DropDownModel } from 'app/models/drop-down-model';
import { AlStatus } from 'app/entities/ris.entities';

export class TagAlListConfig {
    get SedList(): FormArray {
        return this.formGroup.get('SedList') as FormArray;
    }

    get SedListIsSelect(): any[] {
        return this.SedList.value.filter(x => x.IS_CHECKED);
    }

    public displayLocalDate = setLocalDate;
    public bankingsDropdown: DropDownModel[];
    public checkedAll: boolean;
    public mUser: ModelUser;
    public formGroup: FormGroup;
    public dataTable: any;
    public loading: number;
    public AlStatus = AlStatus;

    // public outStandingBalanceState: number;
    // public borrowMoneyState: number;
}