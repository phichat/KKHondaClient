import { IPrintSlip } from './print-slip.interface';
import { Observable } from 'rxjs/Observable';
import { Input } from '@angular/core';

export class FormPrintSlip {
  @Input() slipList: Observable<IPrintSlip[]>;
  @Input() title: string;
  onPrint(slipNo: string): void { };
}