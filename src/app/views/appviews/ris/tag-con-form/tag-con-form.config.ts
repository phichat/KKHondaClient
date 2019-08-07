import { FormArray, FormGroup } from '@angular/forms';
import { ModelUser } from 'app/models/users';
import { DropDownModel } from 'app/models/drop-down-model';
import { RisConfig } from '../ris.config';
import { BehaviorSubject } from 'rxjs';

export class TagConFormConfig extends RisConfig {

    public mUser: ModelUser;
    public formGroup: FormGroup;
    public dataTable: any;
    public loading: number;
    public reasonDropdown: DropDownModel[];

    public $BookingId: number;
    public $Car = new BehaviorSubject<any>(null);

    public TagListItem$ = new BehaviorSubject<any[]>([]);
    public TagHistory$ = new BehaviorSubject<any>(null);
}