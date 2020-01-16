import { Component, Input } from '@angular/core';
import { appConfig } from 'app/app.config';
import { Observable } from 'rxjs/Observable';
import { FormPrintSlip, IPrintSlip } from 'app/views/components/print-slip';

@Component({
  selector: 'app-form-print-tax',
  templateUrl: '../../../components/print-slip/form-print-slip.component.html'
})

export class FormPrintTaxComponent implements FormPrintSlip {
  @Input() bookingId: number;
  url = `${appConfig.apikkWeb}/php/print_tax_3.php`;

  @Input() slipList: Observable<IPrintSlip[]>;
  @Input() title: string;
  onPrint(slipNo: string): void {
    window.open(`${this.url}?booking_id=${this.bookingId}&tax_inv_no=${slipNo}`);
  }
}