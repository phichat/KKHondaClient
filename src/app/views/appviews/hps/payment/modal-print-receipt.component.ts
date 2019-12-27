import { Component, OnInit, Input } from '@angular/core';
import { IReceipt } from './receipt.interface';
import { appConfig } from 'app/app.config';

@Component({
  selector: 'app-modal-print-receipt',
  templateUrl: 'modal-print-receipt.component.html'
})

export class ModalPrintReceiptComponent implements OnInit {

  @Input() receiptList: IReceipt[] = [];
  @Input() bookingId: number = 0;

  constructor() { }

  ngOnInit() { }

  onPrintReceipt(value: any) {
    window.open(`${appConfig.apikkWeb}/php/print_receive_3.php?booking_id=${value.bookingId}&receipt_no=${value.receiptNo}`);
  }
}