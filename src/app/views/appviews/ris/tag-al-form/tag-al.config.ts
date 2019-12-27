import { FormArray, FormGroup } from '@angular/forms';
import { ModelUser } from 'app/models/users';
import { DropDownModel } from 'app/models/drop-down-model';
import { AlStatus } from 'app/entities/ris.entities';
import { RisConfig } from '../ris.config';
import { IUserResCookie } from 'app/interfaces/users';
import { Input } from '@angular/core';
import { PaymentTypeList, PaymentType } from 'app/entities/general.entities';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class TagAlConfig extends RisConfig {
    get SedList(): FormArray {
        return this.formGroup.get('SedList') as FormArray;
    }

    get SedListIsSelect(): any[] {
        return this.SedList.value.filter(x => x.IS_CHECKED);
    }

    public bankingsDropdown: DropDownModel[];
    public reasonDropdown: DropDownModel[];
    public checkedAll: boolean;
    public mUser: IUserResCookie;
    public formGroup: FormGroup;
    public loading: number;
    public AlStatus = AlStatus;

    public outStandingBalanceState: number;
    public borrowMoneyState: number;
    public price2RemainState: number;
    PaymentType = PaymentType;
    PaymentTypeList = PaymentTypeList;

    PaymentData = new BehaviorSubject(null);
}