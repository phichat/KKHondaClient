import { RisConfig } from '../ris.config';
import { FormGroup } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { EntityType } from 'app/entities/general.entities';
import { DropDownModel } from 'app/models/drop-down-model';

export class TahHistoryConfig extends RisConfig {
    public formGroup: FormGroup;
    public EntityType = EntityType;
    public companyDropdown: DropDownModel[];
    public provinceDropdown: DropDownModel[];
    public preNameDropdown: DropDownModel[];

    @Output() ENo = new EventEmitter<string>();
    @Output() FNo = new EventEmitter<string>();
}