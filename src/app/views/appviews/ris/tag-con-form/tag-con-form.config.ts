import { FormArray, FormGroup } from '@angular/forms';
import { ModelUser } from 'app/models/users';
import { DropDownModel } from 'app/models/drop-down-model';
import { RisConfig } from '../ris.config';
import { BehaviorSubject } from 'rxjs';
import { RisLocalStoreage as LS } from 'app/entities/ris.entities';
import { IUserResCookie } from 'app/interfaces/users';

export class TagConFormConfig extends RisConfig {

    public mUser: IUserResCookie;
    public formGroup: FormGroup;
    public dataTable: any;
    public loading: number;
    public reasonDropdown: DropDownModel[];

    public $Car = new BehaviorSubject<any>(null);

    public TagListItem$ = new BehaviorSubject<any[]>([]);
    public TagHistory$ = new BehaviorSubject<any>(null);
}