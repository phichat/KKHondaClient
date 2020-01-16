import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormPrintSlip, IPrintSlip } from 'app/views/components/print-slip';
import { appConfig } from 'app/app.config';

@Component({
  selector: 'app-form-print-receipt',
  templateUrl: '../../../components/print-slip/form-print-slip.component.html'
})

export class FormPrintReceiptComponent implements FormPrintSlip {
  @Input() bookingId: number;
  url = `${appConfig.apikkWeb}/php/print_receive_3.php`;

  @Input() slipList: Observable<IPrintSlip[]>;
  @Input() title: string;
  onPrint(slipNo: string): void {
    window.open(`${this.url}?booking_id=${this.bookingId}&receipt_no=${slipNo}`);
  }
}