import { Observable } from 'rxjs/Observable';
import { DropDownModel } from 'app/models/drop-down-model';
import { Input } from '@angular/core';

export class FormCancelSlip1Config {
  @Input() title: string;
  @Input() slipNo: string;
  @Input() reasonDropdown: Observable<DropDownModel[]>;
  onCancel(): void { };
  onConfirmCancel(value: boolean): void { };
}