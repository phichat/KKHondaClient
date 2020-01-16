import { FormCancelSlipConfig } from './form-cancel-slip.config';
import { Observable } from 'rxjs/Observable';
import { DropDownModel } from 'app/models/drop-down-model';
import { Input } from '@angular/core';
import { ICancelSlip } from './cancel-slip.interface';

export class FormCancelSlip2Config {
  @Input() title: string;
  @Input() slipList: Observable<ICancelSlip[]>;
  @Input() reasonDropdown: Observable<DropDownModel[]>;
  onCancel(): void { };
  onConfirmCancel(value: boolean): void { };
}