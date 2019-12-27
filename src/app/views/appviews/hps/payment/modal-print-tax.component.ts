import { Component, OnInit, Input } from '@angular/core';
import { ITax } from './tax.interface';
import { appConfig } from 'app/app.config';

@Component({
  selector: 'app-modal-print-tax',
  templateUrl: 'modal-print-tax.component.html'
})

export class ModalPrintTaxComponent implements OnInit {

  @Input() taxList: ITax[] = [];
  @Input() bookingId: number = 0;

  constructor() { }

  ngOnInit() {
   }

  onPrintTax(value: any) {
    window.open(`${appConfig.apikkWeb}/php/print_tax_3.php?booking_id=${value.bookingId}&tax_inv_no=${value.taxInvNo}`);
  }
}