import { Component, OnInit, Input } from '@angular/core';
import { HistoryPaymentModel } from '../../../../models/credit/history-payment.model';

@Component({
  selector: 'app-rpt-payment-history',
  templateUrl: './rpt-payment-history.component.html'
})
export class RptPaymentHistoryComponent implements OnInit {

  @Input() paymentHistory = new HistoryPaymentModel();

  constructor() { 
  }

  ngOnInit() {
  }

}
