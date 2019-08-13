import { RisConfig } from '../ris.config';
import { FormGroup } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

export class TahHistoryConfig extends RisConfig {
    public formGroup: FormGroup;

    @Output() ENo = new EventEmitter<string>();
    @Output() FNo = new EventEmitter<string>();
}