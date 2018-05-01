import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ModelSummary } from '../../../../models/selling';
import { ActivatedRoute } from '@angular/router';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  path: string;
  bookingCodeLabel: string;
  modelSummary = new ModelSummary();

  @Input() isSubmit: boolean;

  constructor(private _activatedRoute: ActivatedRoute) {
    this._activatedRoute.snapshot.url.map(p => this.path = p.path);
    
  }

  ngOnInit() {
    this.bookingCodeLabel = this.path == 'selling' ? 'เลขที่ใบขาย' : 'เลขที่ใบจอง';
    this.modelSummary.status = this.path == 'selling' ? 'ขายรถ' : 'จองรถ';
    this.isSubmit = false;
    this.modelSummary.bookingCode = 'New';
    this.modelSummary.totalMotobike = 0;
    this.modelSummary.totalAccessory = 0;
    this.modelSummary.totalSell = 0;
    this.modelSummary.totalDiscount = 0;
    this.modelSummary.totalVatPrice = 0;
    this.modelSummary.totalSellNet = 0;


  }

}
