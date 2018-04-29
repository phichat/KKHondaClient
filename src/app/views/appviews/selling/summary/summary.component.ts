import { Component, OnInit } from '@angular/core';
import { ModelSummary } from '../../../../models/selling';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  modelSummary = new ModelSummary();

  constructor() {
    this.modelSummary.bookingCode = 'New';
    // this.modelSummary.bookingStatus = 'New';
    this.modelSummary.totalMotobike = 0;
    this.modelSummary.totalAccessory = 0;
    this.modelSummary.totalSell = 0;
    this.modelSummary.totalDiscount = 0;
    this.modelSummary.totalVatPrice = 0;
    this.modelSummary.totalSellNet = 0;
  }

  ngOnInit() {
  }

}
